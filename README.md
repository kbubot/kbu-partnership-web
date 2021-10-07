# KBU Partnership Manage Website

Courtesy of hoffnung8493 of [이미지-관리-풀스택](https://www.inflearn.com/course/%EC%9D%B4%EB%AF%B8%EC%A7%80-%EA%B4%80%EB%A6%AC-%ED%92%80%EC%8A%A4%ED%83%9D#curriculum)

env 파일은 별도의 레포지토리에서 관리합니다.

`server/uploads` 디렉토리 내의 파일은 레포지토리 사용자의 DB와 동기화됩니다.


## Client Setup

Bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

### 1. production

```json
// Check base url at package.json
"homepage": "<host ip>:5000"

// Check base url at InteractiveBox.js and MainContent.js
REACT_APP_PROD_SERVER_DOMAIN

// And go to Server Setup
...
```


### 2. dev

```json
// Modify base url at package.json
"proxy": "http://localhost:5000"

// Modify base url at InteractiveBox.js and MainContent.js
REACT_APP_PROD_SERVER_DOMAIN to REACT_APP_DEV_SERVER_DOMAIN
```

```bash
# Install dependencies (only the first time)
cd client && npm install

# Run the local server at localhost:3000
npm run dev
```

## Server Setup

Download [Node.js](https://nodejs.org/en/download/).

### 1. production

```bash
# Build Front-end files
cd client && npm run build

# Install dependencies (only the first time)
cd server && npm install

# Run the host server at <host ip>:5000
npm run start
```

### 2. dev

```bash
# Install dependencies (only the first time)
cd server && npm install

# Run the local server at localhost:5000
npm run dev
```
