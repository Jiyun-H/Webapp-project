# Foodie

# command for running whole project

`docker-compose up --build`

[//]: # "- to build docker image"
[//]: # "`docker-compose build`"
[//]: # "- to run docker container"
[//]: # "`docker-compose up -d`"

# command for separate running backend and frontend

- To start backend
  `cd backend`
  `npm start`
- To start frontend
  `cd frontend`
  `npm start`

# View in the browser after running project

- frontend
  http://localhost:3001
- backend
  http://localhost:5001

# user dashboard example (but you need to login before access due to jwt token)

- customer dashboard <br>
- link: http://localhost:3001/customerDashboard/668922df0e19088a9c06257d
  id: mina@customer.test <br>
  password: 1234 <br>
- restaurant Owner dashboard <br>
- link: http://localhost:3001/restaurantDashboard/6689476184112dfa6759b3f0
  id: jay@rest.test <br>
  password: 1234 <br>

# Restaurant profile page example

- restaurant profile page(Jay's schnitzelhaus): http://localhost:3001/6689476284112dfa6759b3f2

# PayPal test account

- PayPal login: (sandbox account)
  email: jay@personal.example.com
  password: 12345678
