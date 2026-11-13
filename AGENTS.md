# Agent instructions: SpaceRescue API

Small Node.js, Express and Mongoose REST API for rescue missions, spaceships and assignments. We must be able to explain every line, so keep the code simple.

## Structure

CommonJS only. Server on port 3000, MongoDB on 127.0.0.1:27017.

1. src/routes picks the controller. src/controllers handles req and res and chooses status codes. src/models holds the Mongoose schemas: spaceship.js, mission.js and assignment.js.
2. Errors go to src/middleware/errorHandler.js with next(err). It has four parameters and logs the real error with console.error.
3. Validation is in the Mongoose schema. Text is trimmed.
4. The only service is src/services/assignmentService.js, because assigning a spaceship has business rules and must be atomic. No other service or repository layer. No new packages without asking.

## API

1. POST 201, GET 200, PUT 200, DELETE 200.
2. Invalid input or invalid id gives 400. Unknown id gives 404. Spaceship not available or mission not open gives 409. Other errors give 500.

## Concurrency

1. Reserve a spaceship with one atomic call: Spaceship.findOneAndUpdate({ _id, status: 'available' }, { status: 'assigned' }). Never read the status first and write afterwards.
2. If creating the assignment fails, roll back the spaceship and mission status.
3. A unique partial index on Assignment is the database safety net. Never remove it.

## Code principles

1. KISS first: the simplest code that works. No extra layers, patterns or features the assignment does not ask for.
2. Single responsibility: routes pick, controllers handle HTTP, the model describes data, middleware handles errors. Never mix them.
3. Small functions that do one thing. Use early return instead of deep nesting.
4. Clear names: functions are verbs (getSpaceshipById), variables say what they hold. No abbreviations.
5. No duplication, but no helper for something used only once.
6. Comments explain why, not what. No commented-out code, unused imports or leftover console.log.
7. async/await with try/catch and next(err). Never swallow an error.
8. Never silence a lint rule or a test to make it pass. If a rule does not fit, stop and ask.

## Rules

1. Code and commit messages in English. Comments may be Danish.
2. Only edit the function in your issue, on your own branch. Merge main in before a PR.
3. Make a short plan and wait for our OK before you change code.
4. If something looks wrong or there is a merge conflict, stop and tell us.
5. The README answers are ours. Do not write them.