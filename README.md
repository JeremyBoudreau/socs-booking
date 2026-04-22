# socs-booking

## Setup

### Development

Run:
```sh
ssh -L 27017:localhost:27017 cs307-user@winter2026-comp307
```

Then create another terminal panel, and run:
```sh
cd client/
npm run dev
```

Then create another terminal panel, and run:
```sh
cd server/
npm run dev
```

### Production

```sh
git pull

# rebuild backend
cd ~/app/server/
npm install
npm run build
pm2 restart socs-booking

# rebuild frontend
cd ~/app/client
npm install
npm run build
```

