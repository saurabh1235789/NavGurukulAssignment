git clone <repo>

cd live-classroom-platform

docker compose up -d

cd backend
npm install
npx prisma migrate dev
npm run dev

cd ../frontend
npm install
npm run dev