# NestJS OAuth 2.0 Server

ระบบ OAuth 2.0 Server สำหรับรองรับการเชื่อมต่อหลายระบบ พร้อม TypeORM และ PostgreSQL

## การติดตั้ง

1. สร้างฐานข้อมูล PostgreSQL:
```sql
CREATE DATABASE oauth2_demo;
```

2. ตั้งค่าไฟล์ .env:
```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=your_username
DB_PASSWORD=your_password
DB_NAME=oauth2_demo
JWT_SECRET=your-super-secret-key-change-in-production
```

3. ติดตั้ง dependencies:
```bash
npm install
```

4. รัน migration:
```bash
npm run typeorm migration:run
```

5. เริ่มต้นใช้งาน:
```bash
npm run start:dev
```

## การใช้งานระบบ

### 1. สร้างระบบใหม่

```bash
curl -X POST http://localhost:3000/auth/systems \
  -H "Content-Type: application/json" \
  -d '{
    "systemId": "system1",
    "name": "System One",
    "description": "First system description",
    "tokenExpirationTime": 3600
  }'
```

### 2. สร้าง OAuth Client

```bash
curl -X POST http://localhost:3000/auth/clients \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Client",
    "systemId": "system1",
    "redirectUris": ["http://localhost:8080/callback"]
  }'
```

### 3. การขอ Authorization Code

```
GET http://localhost:3000/auth/authorize?
  response_type=code&
  client_id=YOUR_CLIENT_ID&
  redirect_uri=http://localhost:8080/callback&
  scope=read,write
```

### 4. การแลกเปลี่ยน Authorization Code เป็น Access Token

```bash
curl -X POST http://localhost:3000/auth/token \
  -H "Content-Type: application/json" \
  -d '{
    "grant_type": "authorization_code",
    "code": "YOUR_AUTH_CODE",
    "client_id": "YOUR_CLIENT_ID",
    "client_secret": "YOUR_CLIENT_SECRET",
    "redirect_uri": "http://localhost:8080/callback"
  }'
```

### 5. การใช้งาน Access Token

```bash
curl -X GET http://localhost:3000/api/resource \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

## โครงสร้างฐานข้อมูล

1. oauth_systems
   - id (UUID)
   - systemId (String, Unique)
   - name (String)
   - description (String)
   - isActive (Boolean)
   - configuration (JSON)
   - tokenExpirationTime (Integer)
   - rateLimit (Integer)

2. oauth_clients
   - id (UUID)
   - clientId (String)
   - clientSecret (String)
   - name (String)
   - redirectUris (String[])
   - permissions (JSON)
   - isActive (Boolean)
   - systemId (UUID, FK)

3. users
   - id (UUID)
   - email (String)
   - password (String)
   - firstName (String)
   - lastName (String)
   - systemId (UUID, FK)
   - systemUserId (String)

4. oauth_tokens
   - id (UUID)
   - accessToken (String)
   - refreshToken (String)
   - expiresIn (Integer)
   - expiresAt (Timestamp)
   - scope (String[])
   - userId (UUID, FK)
   - clientId (UUID, FK)

## การทดสอบด้วย Postman

1. สร้าง Environment ใน Postman:
   - base_url: http://localhost:3000
   - client_id: (จาก OAuth Client ที่สร้าง)
   - client_secret: (จาก OAuth Client ที่สร้าง)
   - redirect_uri: http://localhost:8080/callback

2. Import Postman Collection:
```json
{
  "info": {
    "name": "OAuth2 Demo",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Get Authorization Code",
      "request": {
        "method": "GET",
        "url": {
          "raw": "{{base_url}}/auth/authorize?response_type=code&client_id={{client_id}}&redirect_uri={{redirect_uri}}&scope=read,write"
        }
      }
    },
    {
      "name": "Get Access Token",
      "request": {
        "method": "POST",
        "url": "{{base_url}}/auth/token",
        "body": {
          "mode": "raw",
          "raw": {
            "grant_type": "authorization_code",
            "code": "YOUR_AUTH_CODE",
            "client_id": "{{client_id}}",
            "client_secret": "{{client_secret}}",
            "redirect_uri": "{{redirect_uri}}"
          }
        }
      }
    }
  ]
}
```

## การเพิ่มระบบใหม่

1. สร้างระบบใหม่ผ่าน API
2. สร้าง OAuth Client สำหรับระบบใหม่
3. กำหนดค่า configuration ตามต้องการ
4. ทดสอบการเชื่อมต่อ

## ความปลอดภัย

1. ใช้ HTTPS ในการ Production
2. เปลี่ยน JWT_SECRET ให้ซับซ้อน
3. กำหนด Rate Limiting
4. ตรวจสอบ IP Address
5. เก็บ Log การเข้าถึง

## การ Monitor

1. ตรวจสอบ Token Usage
2. ดู System Statistics
3. ตรวจสอบ Rate Limiting
4. Monitor Database Performance