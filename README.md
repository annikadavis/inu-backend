# Development

## Required Installations

- mysql version 5.7
- node.js v10+

## How to start

- Install dependencies with `npm install`
- remove `.example` from `.env.example` and add your credentials.
- create database with entering mysql console using `mysql -u root` and run the command `CREATE DATABASE inu_health`
- start the application with `npm start`

# :milky_way: API endpoints

### Global endpoints

| Method          | Endpoint | Description                        | Path Parameter | Request Query Parameter | Request Body | Response Body | Response Status |
| --------------- | -------- | ---------------------------------- | -------------- | ----------------------- | ------------ | ------------- | --------------- |
| GET             | /api     | Returns informations about our API | none           | none                    | none         | api Version   |
| and description | 200      |

### Daily Suggestions endpoints

| Method | Endpoint                                     | Description                       | Path Parameter | Request Query Parameter | Request Body | Response Body     | Response Status |
| ------ | -------------------------------------------- | --------------------------------- | -------------- | ----------------------- | ------------ | ----------------- | --------------- |
| GET    | /api/dailysuggestions/:phaseid               | Returns a random daily suggestion | phase id       | none                    | none         | single suggestion | 200             |
| PUT    | /api/dailysuggestions/:phaseid               | Update a suggestion               | none           | none                    | none         | Updated suggestion is now saved in DB        | 200             |
| POST   | /api/dailysuggestions/:phaseid               | Add a new suggestion              | none           | none                    | none         | New suggestion is added| 200             |
| DELETE | /api/dailysuggestions/:phaseid/:suggestionid | Delete a suggestion               | none           | none                    | none         | Suggestion is deleted  | 204            |

### Therapy Sessions endpoints

| Method | Endpoint         | Description                        | Path Parameter | Request Query Parameter | Request Body    | Response Body          | Response Status |
| ------ | ---------------- | ---------------------------------- | -------------- | ----------------------- | --------------- | ---------------------- | --------------- |
| GET    | /api/therapy     | Returns the list of therapy audios | none           | none                    | none            | list of therapy audios | 200             |
| GET    | /api/therapy/:id | Returns one of therapy audios      | therapyid      | none                    | none            | single audio           | 200             |
| PUT    | /api/therapy/:id | Update a single therapy            | therapyid      | none                    | Therapy updated | Therapy updated        | 200             |
| POST   | /api/therapy/    | Add new therapy                    | none           | none                    | Therapy added   | Therapy added          | 200             |
| DELETE | /api/therapy/:id | Delete teraphy                     | therapyid      | none                    | Therapy deleted | Therapy deleted        | 204             |
### Period Data endpoints

| Method | Endpoint   | Description                                                                 | Path Parameter | Request Query Parameter | Request Body | Response Body    | Response Status |
| ------ | ---------- | --------------------------------------------------------------------------- | -------------- | ----------------------- | ------------ | ---------------- | --------------- |
| GET    | /api/cycle/:userid | Returns the first day of last period and the cycle length and period length | userid           | none                    | none         | Date and number(cycle length) | 200             |
| PUT | /api/cycle/:userid | Updates the first day of last period and the cycle length and period length | userid | none | none | Updated Date and number (cycle length) | 200 |
| POST | /api/cycle/:userid | Adds the first day of last period and the cycle length and period length |userid | none | none |  Adds a Date and number (cycle length) | 200 |
| DELETE | /api/cycle/:userid| Deletes the first day of last period and the cycle length and period length | userid| none | none |  Deleted Date and number (cycle length) | 204 |
