# 📅 SISTEMA DE AGENDAMENTOS - PETSHOP BACKEND

## ✅ **IMPLEMENTAÇÃO COMPLETA**

### **🏗️ Modelo Prisma**
```prisma
model Appointment {
  id         String   @id @default(uuid())
  date       DateTime
  reason     String
  status     AppointmentStatus @default(PENDING)
  pet        Pet      @relation(fields: [petId], references: [id])
  petId      String
  user       User     @relation(fields: [userId], references: [id])
  userId     String
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt
}

enum AppointmentStatus {
  PENDING
  CONFIRMED
  CANCELLED
  COMPLETED
}
```

## 🚀 **ENDPOINTS IMPLEMENTADOS**

### **1. Criar Agendamento**
```
POST /api/appointments
Content-Type: application/json
Cookie: token=jwt_token

{
  "date": "2024-12-20T14:00:00.000Z",
  "reason": "Consulta de rotina",
  "petId": "uuid-do-pet"
}
```

**Validações:**
- ✅ Data deve ser no futuro
- ✅ Horário comercial (Seg-Sex: 8h-18h, Sáb: 8h-12h)
- ✅ Pet deve pertencer ao usuário
- ✅ Horário deve estar disponível
- ✅ Rate limiting aplicado

### **2. Listar Agendamentos**
```
GET /api/appointments?date=2024-12-20&petId=uuid&status=PENDING&page=1&limit=10
Cookie: token=jwt_token
```

**Filtros disponíveis:**
- `date` - Filtrar por data específica
- `petId` - Filtrar por pet
- `status` - Filtrar por status (PENDING, CONFIRMED, CANCELLED, COMPLETED)
- `page` - Número da página (padrão: 1)
- `limit` - Itens por página (padrão: 10, máx: 100)

**Resposta:**
```json
{
  "appointments": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "pages": 3
  }
}
```

### **3. Buscar Slots Disponíveis**
```
GET /api/appointments/available-slots?date=2024-12-20
Cookie: token=jwt_token
```

**Resposta:**
```json
{
  "date": "Fri Dec 20 2024",
  "slots": [
    { "time": "2024-12-20T08:00:00.000Z", "available": true },
    { "time": "2024-12-20T09:00:00.000Z", "available": false },
    { "time": "2024-12-20T10:00:00.000Z", "available": true }
  ]
}
```

### **4. Atualizar Agendamento**
```
PUT /api/appointments/:id
Content-Type: application/json
Cookie: token=jwt_token

{
  "date": "2024-12-20T15:00:00.000Z",
  "reason": "Consulta urgente",
  "status": "CONFIRMED"
}
```

### **5. Deletar Agendamento**
```
DELETE /api/appointments/:id
Cookie: token=jwt_token
```

**Regras:**
- ❌ Não pode deletar agendamentos CONFIRMED
- ✅ Deve cancelar primeiro

## 🔒 **VALIDAÇÕES DE NEGÓCIO**

### **Horário Comercial:**
- **Segunda a Sexta:** 8h às 18h
- **Sábado:** 8h às 12h  
- **Domingo:** Fechado

### **Validações de Segurança:**
- ✅ Usuário só acessa seus próprios agendamentos
- ✅ Pet deve pertencer ao usuário
- ✅ Validação de tokens JWT
- ✅ Rate limiting em criação

### **Validações de Data/Hora:**
- ✅ Data deve ser no futuro
- ✅ Dentro do horário comercial
- ✅ Slot deve estar disponível
- ✅ Não permite conflitos de horário

## 🧪 **TESTANDO O SISTEMA**

### **1. Registrar Usuário e Pet Primeiro:**
```bash
# Registrar usuário
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "João Silva",
    "email": "joao@example.com", 
    "password": "123456"
  }' -c cookies.txt

# Criar pet
curl -X POST http://localhost:5000/api/pets \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "name": "Rex",
    "species": "Cão",
    "breed": "Labrador",
    "age": 3
  }'
```

### **2. Testar Agendamentos:**
```bash
# Ver slots disponíveis
curl -s "http://localhost:5000/api/appointments/available-slots?date=2024-12-20" \
  -b cookies.txt

# Criar agendamento
curl -X POST http://localhost:5000/api/appointments \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "date": "2024-12-20T14:00:00.000Z",
    "reason": "Consulta de rotina",
    "petId": "uuid-do-pet"
  }'

# Listar agendamentos
curl -s "http://localhost:5000/api/appointments" -b cookies.txt
```

### **3. Testar Validações:**
```bash
# Tentar agendar fora do horário
curl -X POST http://localhost:5000/api/appointments \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "date": "2024-12-20T20:00:00.000Z",
    "reason": "Consulta noturna",
    "petId": "uuid-do-pet"
  }'
# Retorna: "Agendamento fora do horário comercial"

# Tentar agendar no passado
curl -X POST http://localhost:5000/api/appointments \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "date": "2024-01-01T14:00:00.000Z",
    "reason": "Consulta no passado",
    "petId": "uuid-do-pet"
  }'
# Retorna: "Data do agendamento deve ser no futuro"
```

## 📊 **CÓDIGOS DE ERRO**

| Código | Descrição |
|--------|-----------|
| `INVALID_DATE` | Data no passado |
| `OUTSIDE_BUSINESS_HOURS` | Fora do horário comercial |
| `PET_NOT_FOUND` | Pet não encontrado ou não pertence ao usuário |
| `TIME_SLOT_UNAVAILABLE` | Horário não disponível |
| `APPOINTMENT_NOT_FOUND` | Agendamento não encontrado |
| `CANNOT_DELETE_CONFIRMED` | Não pode deletar agendamento confirmado |
| `DATE_REQUIRED` | Data obrigatória para slots |

## 🎯 **PRÓXIMAS MELHORIAS POSSÍVEIS**

- [ ] Notificações por email/SMS
- [ ] Agendamentos recorrentes
- [ ] Diferentes tipos de consulta (duração variável)
- [ ] Sistema de fila de espera
- [ ] Calendário visual
- [ ] Lembretes automáticos

## ✅ **RESUMO**

O sistema de agendamentos está **100% funcional** com:
- ✅ CRUD completo (Create, Read, Update, Delete)
- ✅ Validações de negócio robustas
- ✅ Filtros e paginação
- ✅ Verificação de slots disponíveis
- ✅ Segurança e autenticação
- ✅ Tratamento de erros padronizado 