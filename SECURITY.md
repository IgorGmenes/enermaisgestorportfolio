# 🛡️ Auditoria e Segurança da Aplicação EnerMais

Este documento descreve os procedimentos críticos de segurança para a implantação e manutenção da aplicação.

## 🚨 ALERTA CRÍTICO: Exposição de Chaves

Foi identificado que a **Service Role Key** (Chave de Admin) pode ter sido exposta no código do Frontend.

### O Risco
A `service_role` key ignora todas as regras de segurança (RLS). Se ela for enviada ao navegador do usuário (através do bundle JS), qualquer visitante pode baixar todos os dados do banco ou deletá-los.

### 🛠️ Ação Imediata Necessária

1.  **Rotacionar a Chave (Supabase)**:
    *   Acesse o Painel do Supabase > Project Settings > API.
    *   Em "Service Role Key", clique em **Rotate secret**.
    *   Isso invalidará imediatamente a chave exposta.
    *   *Nota:* Isso quebrará scripts de backend (Databricks) até que sejam atualizados com a nova chave.

2.  **Limpar o Frontend (`.env`)**:
    *   Abra o arquivo `frontend/.env`.
    *   Verifique a variável `VITE_SUPABASE_KEY`.
    *   **ELA DEVE SER A ANON KEY (PUBLIC)**.
    *   Se ela for a Service Role Key, substitua pela Anon Key imediatamente.

3.  **Rebuild da Aplicação**:
    *   Após trocar a chave no `.env`, pare o servidor de desenvolvimento.
    *   Execute `npm run build` novamente para gerar um novo bundle sem a chave maliciosa.

## Arquitetura de Segredos

| Chave | Onde pode ficar? | Uso |
| :--- | :--- | :--- |
| **ANON_KEY** (Public) | Frontend (`.env`, código cliente) | Autenticação e acesso restrito por RLS. |
| **SERVICE_ROLE** (Secret) | **APENAS Backend** (Databricks, Edge Functions) | ETL, Administração, Jobs Cron. **Nunca no Frontend**. |

## Row Level Security (RLS)

Garantir que o RLS esteja ativo no banco de dados:

```sql
ALTER TABLE portfolio_prata ENABLE ROW LEVEL SECURITY;

-- Política de Leitura (Exemplo: Apenas logados)
CREATE POLICY "Permitir leitura para autenticados"
ON portfolio_prata FOR SELECT
TO authenticated
USING (true);
```

Se o RLS estiver desligado, mesmo a Anon Key permite acesso total.
