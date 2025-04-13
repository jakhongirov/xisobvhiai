const express = require("express")
const router = express.Router()

//Middlawares
const {
   AUTH
} = require('../middleware/auth')
const FileUpload = require('../middleware/multer')

// files
const admin = require('./admin/admin')
const payment = require('./payment/payment')
const atmos = require('./atmos/atmos')
const users = require('./users/users')
const transaction = require('./transaction/transaction')
const partners = require('./partners/partners')
const price = require('./price/price')

router

   /**
    * components:
    *    securitySchemes:
    *       token:
    *       type: apiKey
    *       in: header
    *       name: token
    */

   // ADMIN API
   /** 
   * @swagger
   * components: 
   *     schemas: 
   *       Admin:
   *          type: object
   *          required: 
   *             - admin_email
   *             - admin_password
   *          properties:
   *             admin_id: 
   *                type: integer
   *                description: auto generate
   *             admin_email: 
   *                type: string
   *                description: admin's email
   *             admin_password:
   *                type: string
   *                description: admin put password for login and it hashing
   *             admin_create_at:
   *                type: string
   *                description: admin created date
   *          example:
   *             admin_id: 1
   *             admin_email: diyor.jakhongirov@gmail.com
   *             admin_password: 2jk3jnnj3nj43nb4j3bjeb3b23j
   *             admin_create_at: 2024-01-23 10:52:41 +0000
  */

   /**
   * @swagger
   * tags:
   *    name: Admin
   *    description: Admin managing API
   */

   /**
   * @swagger
   * /admin/list:
   *   get:
   *     summary: Returns the list of all the admins for Frontend developer
   *     tags: [Admin]
   *     security:
   *       - token: []
   *     parameters:
   *        - in: header
   *          name: token
   *          required: true
   *          schema:
   *             type: string
   *          description: Authentication token
   *        - in: query
   *          name: limit
   *          schema:
   *             type: integer
   *          description: limit of list
   *        - in: query
   *          name: page
   *          schema:
   *             type: integer
   *          description: page of list
   *     responses:
   *       '200':
   *          description: The list of the admins
   *          content:
   *             application/json:
   *                schema:
   *                   type: array
   *                items:
   *                   $ref: '#/components/schemas/Admin'
   *          headers:
   *             token:
   *                description: Token for authentication
   *                schema:
   *                type: string
   *       '500':
   *          description: Some server error
   */
   .get('/admin/list', AUTH, admin.GET_ADMIN)

   /**
   * @swagger
   * /admin/register:
   *    post:
   *       summary: Register new admin for Frontend developer
   *       tags: [Admin]
   *       requestBody:
   *          required: true
   *          content: 
   *             application/json:
   *                schema:
   *                   $ref: '#/components/schemas/Admin'
   *       responses:
   *          200:
   *             description: Created new admin
   *             content:
   *                application/json:
   *                   schema:
   *                      $ref: '#/components/schemas/Admin'
   *          500:
   *             description: Some server error
   */
   .post('/admin/register', admin.REGISTER_ADMIN)

   /**
   * @swagger
   * /admin/login:
   *    post:
   *       summary: Login admin for Frontend developer
   *       tags: [Admin]
   *       requestBody:
   *          required: true
   *          content:
   *             application/json:
   *                schema:
   *                   $ref: '#/components/schemas/Admin'
   *       responses:
   *          200:
   *             description: You logined
   *             content: 
   *                application/json:
   *                   schema:
   *                      $ref: '#/components/schemas/Admin' 
   *          500:
   *             description: Server error
   */
   .post('/admin/login', admin.LOGIN_ADMIN)

   /**
   * @swagger
   * /admin/edit:
   *    put:
   *       summary: Change admin's email and password for Frontend developer
   *       tags: [Admin]
   *       parameters:
   *        - in: header
   *          name: token
   *          required: true
   *          schema:
   *             type: string
   *          description: Authentication token      
   *       security:
   *          - token: []
   *       requestBody:
   *          required: true
   *          content:
   *             application/json:
   *                schema:
   *                   $ref: '#/components/schemas/Admin'
   *       responses:
   *          200:
   *             description: Changed data
   *             content: 
   *                application/json:
   *                   schema:
   *                      $ref: '#/components/schemas/Admin' 
   *             headers:
   *                token:
   *                   description: Token for authentication
   *                   schema:
   *                   type: string
   *          500:
   *             description: Server error
   */
   .put('/admin/edit', AUTH, admin.EDIT_ADMIN)

   /**
    * @swagger
    * /admin/delete:
    *    delete:
    *       summary: Delete admin for Frontend developer
    *       tags: [Admin]
    *       parameters:
    *        - in: header
    *          name: token
    *          required: true
    *          schema:
    *             type: string
    *          description: Authentication token 
    *       security:
    *          - token: []
    *       requestBody:
    *          required: true
    *          content:
    *             application/json:
    *                schema:
    *                   $ref: '#/components/schemas/Admin'
    *       responses:
    *          200:
    *             description: Deleted admin
    *             content: 
    *                application/json:
    *                   schema:
    *                      $ref: '#/components/schemas/Admin' 
    *             headers:
    *                token:
    *                   description: Token for authentication
    *                   schema:
    *                   type: string
    *          500:
    *             description: Server error
    */
   .delete('/admin/delete', AUTH, admin.DELETE_ADMIN)

   // USERS API
   /**
    * @swagger
    * components:
    *   schemas:
    *     Users:
    *       type: object
    *       properties:
    *         id:
    *           type: integer
    *           format: int64
    *           example: 1
    *         name:
    *           type: string
    *           example: John Doe
    *         phone_number:
    *           type: string
    *           example: "+998901234567"
    *         password:
    *           type: string
    *           example: "hashed_password"
    *         premium:
    *           type: boolean
    *           default: false
    *           example: true
    *         expired_date:
    *           type: integer
    *           format: int64
    *           example: 1700000000000
    *         telegram_bot:
    *           type: boolean
    *           default: false
    *         chat_id:
    *           type: integer
    *           format: int64
    *           example: 123456789
    *         bot_step:
    *           type: string
    *           example: "awaiting_password"
    *         bot_lang:
    *           type: string
    *           example: "en"
    *         duration:
    *           type: boolean
    *           default: false
    *         source:
    *           type: string
    *           example: "instagram"
    *         partner_id:
    *           type: integer
    *           format: int64
    *           example: 2
    *         monthly_amount:
    *           type: integer
    *           format: int64
    *           example: 30000
    *         limit_amount:
    *           type: integer
    *           format: int64
    *           default: 0
    *         user_blocked:
    *           type: boolean
    *           default: false
    *         used_free:
    *           type: boolean
    *           default: false
    *         create_at:
    *           type: string
    *           format: date-time
    *           example: "2025-04-13T12:00:00Z"
    */

   /**
    * @swagger
    * tags:
    *    name: Users
    *    description: Users api documentation
    */

   /**
   * @swagger
   * /users/list:
   *   get:
   *     summary: Returns a list of all users, for Frontend developers
   *     tags: [Users]
   *     security:
   *       - token: []
   *     parameters:
   *       - in: header
   *         name: token
   *         required: true
   *         schema:
   *           type: string
   *         description: Authentication token
   *       - in: query
   *         name: limit
   *         required: true
   *         schema:
   *           type: integer
   *         description: Limit for the number of users in the list
   *       - in: query
   *         name: page
   *         required: true
   *         schema:
   *           type: integer
   *         description: Page number for pagination
   *       - in: query
   *         name: phone
   *         required: false
   *         schema:
   *           type: string
   *         description: phone number for search
   *     responses:
   *       '200':
   *         description: A list of users
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: '#/components/schemas/Users'
   *         headers:
   *           token:
   *             description: Token for authentication
   *             schema:
   *               type: string
   *       '500':
   *         description: Server error
   */
   .get('/users/list', AUTH, users.GET)

   /**
   * @swagger
   * /user/{chat_id}:
   *   get:
   *     summary: Get user data by chat id
   *     tags: [Users]
   *     security:
   *       - token: []
   *     parameters:
   *       - in: header
   *         name: token
   *         required: true
   *         schema:
   *           type: string
   *         description: Authentication token
   *       - in: path
   *         name: chat_id
   *         required: true
   *         schema:
   *           type: integer
   *         description: User's chat id
   *     responses:
   *       '200':
   *         description: User data retrieved successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Users'
   *         headers:
   *           token: 
   *             description: Token for authentication
   *             schema:
   *               type: string
   *       '500':
   *         description: Server error
   */
   .get('/user/:chat_id', AUTH, users.GET_ID)

   /**
    * @swagger
    * /user/statistics:
    *   get:
    *     summary: Get user statistics
    *     tags: [Users]
    *     security:
    *       - token: []
    *     parameters:
    *       - in: header
    *         name: token
    *         required: true
    *         schema:
    *           type: string
    *         description: Authentication token
    *     responses:
    *       '200':
    *         description: Successfully retrieved user statistics
    *         content:
    *           application/json:
    *             schema:
    *               type: object
    *               properties:
    *                 status:
    *                   type: integer
    *                   example: 200
    *                 message:
    *                   type: string
    *                   example: Success
    *                 data:
    *                   type: object
    *                   properties:
    *                     all_user:
    *                       type: integer
    *                       example: 150
    *                       description: Total number of users
    *                     payed_user:
    *                       type: integer
    *                       example: 45
    *                       description: Total number of users who have paid
    *       '500':
    *         description: Internal Server Error
    */
   .get('/user/statistics', AUTH, users.USER_STATIS)

   /**
    * @swagger
    * /user/statistics/source:
    *   get:
    *     summary: Get statistics by source
    *     tags: [Users]
    *     security:
    *       - token: []
    *     parameters:
    *       - in: header
    *         name: token
    *         required: true
    *         schema:
    *           type: string
    *         description: Authentication token
    *     responses:
    *       '200':
    *         description: Successfully retrieved source-based statistics
    *         content:
    *           application/json:
    *             schema:
    *               type: object
    *               properties:
    *                 status:
    *                   type: integer
    *                   example: 200
    *                 message:
    *                   type: string
    *                   example: Success
    *                 data:
    *                   type: array
    *                   items:
    *                     type: object
    *                     properties:
    *                       source:
    *                         type: string
    *                         example: instagram
    *                       count:
    *                         type: integer
    *                         example: 27
    *       '500':
    *         description: Internal Server Error
    */
   .get('/user/statistics/source', AUTH, users.STATISTICS_SOURCE)

   /**
    * @swagger
    * /user/statistics/increase:
    *   get:
    *     summary: Get statistics increase data
    *     tags: [Users]
    *     security:
    *       - token: []
    *     parameters:
    *       - in: header
    *         name: token
    *         required: true
    *         schema:
    *           type: string
    *         description: Authentication token
    *     responses:
    *       '200':
    *         description: Successfully retrieved statistics increase data
    *         content:
    *           application/json:
    *             schema:
    *               type: object
    *               properties:
    *                 status:
    *                   type: integer
    *                   example: 200
    *                 message:
    *                   type: string
    *                   example: Success
    *                 data:
    *                   type: array
    *                   items:
    *                     type: object
    *                     properties:
    *                       date:
    *                         type: string
    *                         format: date
    *                         example: 2025-04-01
    *                       count:
    *                         type: integer
    *                         example: 12
    *       '500':
    *         description: Internal Server Error
    */
   .get('/user/statistics/increase', AUTH, users.STATISTICS_INCREASE)

   /**
    * @swagger
    * /user/source:
    *   get:
    *     summary: Get all available sources
    *     tags: [Users]
    *     security:
    *       - token: []
    *     parameters:
    *       - in: header
    *         name: token
    *         required: true
    *         schema:
    *           type: string
    *         description: Authentication token
    *     responses:
    *       '200':
    *         description: Successfully retrieved source list
    *         content:
    *           application/json:
    *             schema:
    *               type: object
    *               properties:
    *                 status:
    *                   type: integer
    *                   example: 200
    *                 message:
    *                   type: string
    *                   example: Success
    *                 data:
    *                   type: array
    *                   items:
    *                     type: object
    *                     properties:
    *                       id:
    *                         type: integer
    *                         example: 1
    *                       name:
    *                         type: string
    *                         example: Instagram
    *       '404':
    *         description: No sources found
    *         content:
    *           application/json:
    *             schema:
    *               type: object
    *               properties:
    *                 status:
    *                   type: integer
    *                   example: 404
    *                 message:
    *                   type: string
    *                   example: Not found
    *       '500':
    *         description: Internal Server Error
    */
   .get('/user/source', AUTH, users.STATISTICS_INCREASE)

   // ATMOS
   .get('/token', atmos.GET_TOKEN)
   .post('/add-card/:chat_id', atmos.ADD_CARD)
   .post('/opt/:chat_id', atmos.OTP)
   .post('/remove-card', atmos.REMOVE_CARD)

   //  PAYMENT
   .get('/payment/check/:chat_id/:tarif/:amount', payment.CHECK)
   .get('/payment/success/:chat_id/:tarif', payment.SUCCESS)

   // TRANSACTION

   /**
   * @swagger
   * tags:
   *    name: Transactions
   *    description: Transactions api documentation
   */

   /**
    * @swagger
    * /transactions/list:
    *   get:
    *     summary: Get paginated list of transactions
    *     tags: [Transactions]
    *     security:
    *       - token: []
    *     parameters:
    *       - in: header
    *         name: token
    *         required: true
    *         schema:
    *           type: string
    *         description: Authentication token
    *       - in: query
    *         name: limit
    *         required: true
    *         schema:
    *           type: integer
    *         description: Number of transactions per page
    *       - in: query
    *         name: page
    *         required: true
    *         schema:
    *           type: integer
    *         description: Page number
    *       - in: query
    *         name: method
    *         required: false
    *         schema:
    *           type: string
    *         description: Filter transactions by payment method
    *     responses:
    *       '200':
    *         description: Successfully retrieved transactions
    *         content:
    *           application/json:
    *             schema:
    *               type: object
    *               properties:
    *                 status:
    *                   type: integer
    *                   example: 200
    *                 message:
    *                   type: string
    *                   example: Success
    *                 data:
    *                   type: array
    *                   items:
    *                     type: object
    *                     properties:
    *                       id:
    *                         type: integer
    *                         example: 1
    *                       amount:
    *                         type: number
    *                         format: float
    *                         example: 25.99
    *                       method:
    *                         type: string
    *                         example: click
    *                       created_at:
    *                         type: string
    *                         format: date-time
    *                         example: 2025-04-13T10:30:00Z
    *       '400':
    *         description: Bad request (missing limit or page)
    *       '404':
    *         description: Transactions not found
    *       '500':
    *         description: Internal Server Error
    */
   .get('/transactions/list', AUTH, transaction.GET)

   /**
    * @swagger
    * /transactions/total/amout:
    *   get:
    *     summary: Get total transaction amount
    *     tags: [Transactions]
    *     security:
    *       - token: []
    *     parameters:
    *       - in: header
    *         name: token
    *         required: true
    *         schema:
    *           type: string
    *         description: Authentication token
    *     responses:
    *       '200':
    *         description: Successfully retrieved total amount
    *         content:
    *           application/json:
    *             schema:
    *               type: object
    *               properties:
    *                 status:
    *                   type: integer
    *                   example: 200
    *                 message:
    *                   type: string
    *                   example: Success
    *                 data:
    *                   type: object
    *                   properties:
    *                     total_amount:
    *                       type: number
    *                       format: float
    *                       example: 10234.75
    *       '500':
    *         description: Internal Server Error
    */
   .get('/transactions/total/amout', AUTH, transaction.TOTAL_AMOUNT)

   /**
    * @swagger
    * /transactions/user:
    *   get:
    *     summary: Get transactions by user ID
    *     tags: [Transactions]
    *     security:
    *       - token: []
    *     parameters:
    *       - in: header
    *         name: token
    *         required: true
    *         schema:
    *           type: string
    *         description: Authentication token
    *       - in: query
    *         name: user_id
    *         required: true
    *         schema:
    *           type: integer
    *         description: ID of the user whose transactions should be fetched
    *     responses:
    *       '200':
    *         description: Transactions retrieved successfully
    *         content:
    *           application/json:
    *             schema:
    *               type: object
    *               properties:
    *                 status:
    *                   type: integer
    *                   example: 200
    *                 message:
    *                   type: string
    *                   example: Success
    *                 data:
    *                   type: array
    *                   items:
    *                     type: object
    *                     properties:
    *                       id:
    *                         type: integer
    *                         example: 12
    *                       amount:
    *                         type: number
    *                         format: float
    *                         example: 45.50
    *                       method:
    *                         type: string
    *                         example: payme
    *                       created_at:
    *                         type: string
    *                         format: date-time
    *                         example: 2025-04-13T12:00:00Z
    *       '404':
    *         description: No transactions found for the given user
    *       '500':
    *         description: Internal Server Error
    */
   .get('/transactions/user', AUTH, transaction.GET_USER_ID)

   /**
    * @swagger
    * /transactions/filter:
    *   get:
    *     summary: Get filtered transactions by month and year with total amount
    *     tags: [Transactions]
    *     security:
    *       - token: []
    *     parameters:
    *       - in: header
    *         name: token
    *         required: true
    *         schema:
    *           type: string
    *         description: Authentication token
    *       - in: query
    *         name: limit
    *         required: true
    *         schema:
    *           type: integer
    *         description: Number of transactions per page
    *       - in: query
    *         name: page
    *         required: true
    *         schema:
    *           type: integer
    *         description: Page number
    *       - in: query
    *         name: month
    *         required: false
    *         schema:
    *           type: integer
    *         description: Filter by month (1-12)
    *       - in: query
    *         name: year
    *         required: false
    *         schema:
    *           type: integer
    *         description: Filter by year (e.g., 2025)
    *     responses:
    *       '200':
    *         description: Successfully retrieved filtered transactions
    *         content:
    *           application/json:
    *             schema:
    *               type: object
    *               properties:
    *                 status:
    *                   type: integer
    *                   example: 200
    *                 message:
    *                   type: string
    *                   example: Success
    *                 data:
    *                   type: array
    *                   items:
    *                     type: object
    *                     properties:
    *                       id:
    *                         type: integer
    *                         example: 1
    *                       amount:
    *                         type: number
    *                         format: float
    *                         example: 99.99
    *                       method:
    *                         type: string
    *                         example: click
    *                       created_at:
    *                         type: string
    *                         format: date-time
    *                         example: 2025-04-13T10:30:00Z
    *                 total:
    *                   type: number
    *                   format: float
    *                   example: 2048.75
    *       '400':
    *         description: Bad request (missing limit or page)
    *       '404':
    *         description: Transactions not found
    *       '500':
    *         description: Internal Server Error
    */
   .get('/transactions/filter', AUTH, transaction.GET_FILTER)

   /**
    * @swagger
    * /transaction/{id}:
    *   get:
    *     summary: Get a single transaction by ID
    *     tags: [Transactions]
    *     security:
    *       - token: []
    *     parameters:
    *       - in: header
    *         name: token
    *         required: true
    *         schema:
    *           type: string
    *         description: Authentication token
    *       - in: path
    *         name: id
    *         required: true
    *         schema:
    *           type: integer
    *         description: ID of the transaction to retrieve
    *     responses:
    *       '200':
    *         description: Transaction found and returned successfully
    *         content:
    *           application/json:
    *             schema:
    *               type: object
    *               properties:
    *                 status:
    *                   type: integer
    *                   example: 200
    *                 message:
    *                   type: string
    *                   example: Success
    *                 data:
    *                   type: object
    *                   properties:
    *                     id:
    *                       type: integer
    *                       example: 101
    *                     amount:
    *                       type: number
    *                       format: float
    *                       example: 99.99
    *                     method:
    *                       type: string
    *                       example: click
    *                     created_at:
    *                       type: string
    *                       format: date-time
    *                       example: 2025-04-13T12:00:00Z
    *       '404':
    *         description: Transaction not found
    *       '500':
    *         description: Internal Server Error
    */
   .get('/transaction/:id', AUTH, transaction.GET_ID)

   /**
    * @swagger
    * /transactions/filter:
    *   get:
    *     summary: Get transactions by user ID
    *     tags: [Transactions]
    *     security:
    *       - token: []
    *     parameters:
    *       - in: header
    *         name: token
    *         required: true
    *         schema:
    *           type: string
    *         description: Authentication token
    *       - in: query
    *         name: user_id
    *         required: true
    *         schema:
    *           type: integer
    *         description: ID of the user whose transactions should be fetched
    *     responses:
    *       '200':
    *         description: Transactions retrieved successfully
    *         content:
    *           application/json:
    *             schema:
    *               type: object
    *               properties:
    *                 status:
    *                   type: integer
    *                   example: 200
    *                 message:
    *                   type: string
    *                   example: Success
    *                 data:
    *                   type: array
    *                   items:
    *                     type: object
    *                     properties:
    *                       id:
    *                         type: integer
    *                         example: 12
    *                       amount:
    *                         type: number
    *                         format: float
    *                         example: 45.50
    *                       method:
    *                         type: string
    *                         example: payme
    *                       created_at:
    *                         type: string
    *                         format: date-time
    *                         example: 2025-04-13T12:00:00Z
    *       '404':
    *         description: No transactions found for the given user
    *       '500':
    *         description: Internal Server Error
    */
   .get('/transactions/filter', AUTH, transaction.GET_FILTER)

   /**
    * @swagger
    * /transactions/statistics/month:
    *   get:
    *     summary: Get monthly statistics
    *     tags: [Transactions]
    *     security:
    *       - token: []
    *     parameters:
    *       - in: header
    *         name: token
    *         required: true
    *         schema:
    *           type: string
    *         description: Authentication token
    *     responses:
    *       '200':
    *         description: Monthly statistics retrieved successfully
    *         content:
    *           application/json:
    *             schema:
    *               type: object
    *               properties:
    *                 status:
    *                   type: integer
    *                   example: 200
    *                 message:
    *                   type: string
    *                   example: Success
    *                 data:
    *                   type: array
    *                   items:
    *                     type: object
    *                     properties:
    *                       month:
    *                         type: string
    *                         example: January
    *                       count:
    *                         type: integer
    *                         example: 45
    *                       total_amount:
    *                         type: number
    *                         format: float
    *                         example: 1200.50
    *       '500':
    *         description: Internal Server Error
    */
   .get('/transactions/statistics/month', AUTH, transaction.GET_STATIS_MONTHS)

   /**
    * @swagger
    * /transactions/statistics/increase:
    *   get:
    *     summary: Get statistics increase data
    *     tags: [Transactions]
    *     security:
    *       - token: []
    *     parameters:
    *       - in: header
    *         name: token
    *         required: true
    *         schema:
    *           type: string
    *         description: Authentication token
    *     responses:
    *       '200':
    *         description: Statistics increase data retrieved successfully
    *         content:
    *           application/json:
    *             schema:
    *               type: object
    *               properties:
    *                 status:
    *                   type: integer
    *                   example: 200
    *                 message:
    *                   type: string
    *                   example: Success
    *                 data:
    *                   type: object
    *                   properties:
    *                     users_growth:
    *                       type: number
    *                       example: 12.5
    *                     revenue_growth:
    *                       type: number
    *                       example: 8.3
    *                     period:
    *                       type: string
    *                       example: "March 2025"
    *       '500':
    *         description: Internal Server Error
    */
   .get('/transactions/statistics/increase', AUTH, transaction.GET_STATIS_INCREASE)


   // PARTNERS

   /**
   * @swagger
   * tags:
   *    name: Partners
   *    description: Partners api documentation
   */

   /**
    * @swagger
    * components:
    *   schemas:
    *     Partner:
    *       type: object
    *       properties:
    *         id:
    *           type: integer
    *           format: int64
    *           example: 1
    *         name:
    *           type: string
    *           example: John Doe
    *         phone_number:
    *           type: string
    *           example: "+998901234567"
    *         chat_id:
    *           type: string
    *           example: "123456789"
    *         discount:
    *           type: integer
    *           format: int64
    *           example: 10
    *         additional:
    *           type: integer
    *           format: int64
    *           example: 5
    *         profit:
    *           type: integer
    *           example: 1000
    *         duration:
    *           type: boolean
    *           example: false
    *         balance:
    *           type: integer
    *           format: int64
    *           example: 25000
    *         create_at:
    *           type: string
    *           format: date-time
    *           example: "2025-04-13T12:00:00Z"
    */

   /**
    * @swagger
    * /partners:
    *   get:
    *     summary: Get a paginated list of partners
    *     tags: [Partners]
    *     parameters:
    *       - in: query
    *         name: limit
    *         required: true
    *         schema:
    *           type: integer
    *         description: Number of partners per page
    *       - in: query
    *         name: page
    *         required: true
    *         schema:
    *           type: integer
    *         description: Page number
    *     responses:
    *       '200':
    *         description: List of partners retrieved successfully
    *         content:
    *           application/json:
    *             schema:
    *               type: object
    *               properties:
    *                 status:
    *                   type: integer
    *                   example: 200
    *                 message:
    *                   type: string
    *                   example: Success
    *                 data:
    *                   type: array
    *                   items:
    *                     $ref: '#/components/schemas/Partner'
    *       '400':
    *         description: Bad request - missing or invalid query parameters
    *       '404':
    *         description: No partners found
    *       '500':
    *         description: Internal server error
    */
   .get('/partners', AUTH, partners.GET_LIST)

   /**
    * @swagger
    * /partners/{id}:
    *   get:
    *     summary: Get partner by ID
    *     tags: [Partners]
    *     parameters:
    *       - in: path
    *         name: id
    *         required: true
    *         schema:
    *           type: integer
    *         description: Partner's ID
    *     responses:
    *       '200':
    *         description: Partner found successfully
    *         content:
    *           application/json:
    *             schema:
    *               type: object
    *               properties:
    *                 status:
    *                   type: integer
    *                   example: 200
    *                 message:
    *                   type: string
    *                   example: Success
    *                 data:
    *                   $ref: '#/components/schemas/Partner'
    *       '404':
    *         description: Partner not found
    *       '500':
    *         description: Internal server error
    */
   .get('/partners/:id', AUTH, partners.GET_ID)

   /**
    * @swagger
    * /partners:
    *   post:
    *     summary: Add a new partner
    *     tags: [Partners]
    *     requestBody:
    *       required: true
    *       content:
    *         application/json:
    *           schema:
    *             type: object
    *             required:
    *               - name
    *               - phone_number
    *             properties:
    *               name:
    *                 type: string
    *                 example: John Doe
    *               phone_number:
    *                 type: string
    *                 example: "+123456789"
    *               discount:
    *                 type: integer
    *                 example: 10
    *               additional:
    *                 type: integer
    *                 example: 5
    *               profit:
    *                 type: integer
    *                 example: 200
    *               duration:
    *                 type: boolean
    *                 example: true
    *     responses:
    *       '201':
    *         description: Partner successfully created
    *         content:
    *           application/json:
    *             schema:
    *               type: object
    *               properties:
    *                 status:
    *                   type: integer
    *                   example: 201
    *                 message:
    *                   type: string
    *                   example: Success
    *                 data:
    *                   $ref: '#/components/schemas/Partner'
    *       '400':
    *         description: Bad request
    *       '500':
    *         description: Internal server error
    */
   .post('/partners', AUTH, partners.ADD_PARTNER)

   /**
    * @swagger
    * /partners:
    *   put:
    *     summary: Edit an existing partner
    *     tags: [Partners]
    *     requestBody:
    *       required: true
    *       content:
    *         application/json:
    *           schema:
    *             type: object
    *             required:
    *               - id
    *             properties:
    *               id:
    *                 type: integer
    *                 example: 1
    *               name:
    *                 type: string
    *                 example: John Doe
    *               phone_number:
    *                 type: string
    *                 example: "+123456789"
    *               discount:
    *                 type: integer
    *                 example: 15
    *               additional:
    *                 type: integer
    *                 example: 3
    *               profit:
    *                 type: integer
    *                 example: 250
    *               duration:
    *                 type: boolean
    *                 example: false
    *     responses:
    *       '200':
    *         description: Partner successfully updated
    *         content:
    *           application/json:
    *             schema:
    *               type: object
    *               properties:
    *                 status:
    *                   type: integer
    *                   example: 200
    *                 message:
    *                   type: string
    *                   example: Success
    *                 data:
    *                   $ref: '#/components/schemas/Partner'
    *       '400':
    *         description: Bad request
    *       '500':
    *         description: Internal server error
    */
   .put('/partners', AUTH, partners.EDIT_PARTNER)

   /**
    * @swagger
    * /partners:
    *   delete:
    *     summary: Delete a partner by ID
    *     tags: [Partners]
    *     requestBody:
    *       required: true
    *       content:
    *         application/json:
    *           schema:
    *             type: object
    *             required:
    *               - id
    *             properties:
    *               id:
    *                 type: integer
    *                 example: 1
    *     responses:
    *       '200':
    *         description: Partner successfully deleted
    *         content:
    *           application/json:
    *             schema:
    *               type: object
    *               properties:
    *                 status:
    *                   type: integer
    *                   example: 200
    *                 message:
    *                   type: string
    *                   example: Success
    *                 data:
    *                   type: object
    *       '400':
    *         description: Bad request
    *       '500':
    *         description: Internal server error
    */
   .delete('/partners', AUTH, partners.DELETE_PARTNER)

   // Price
   /**
   * @swagger
   * components:
   *   schemas:
   *     Price:
   *       type: object
   *       properties:
   *         id:
   *           type: integer
   *           example: 1
   *         title_uz:
   *           type: string
   *           example: "Bir oylik obuna"
   *         title_ru:
   *           type: string
   *           example: "Подписка на месяц"
   *         title_eng:
   *           type: string
   *           example: "One month subscription"
   *         period:
   *           type: integer
   *           description: Duration of the subscription in days
   *           example: 30
   *         price:
   *           type: integer
   *           description: Price in smallest currency unit (e.g., cents or tiyin)
   *           example: 25000
   *         sort_order:
   *           type: integer
   *           description: Order for displaying prices
   *           example: 1
   *         create_at:
   *           type: string
   *           format: date-time
   *           example: "2025-04-13T10:20:30Z"
   */

   /**
    * @swagger
    * tags:
    *    name: Price
    *    description: Price managing API
    */

   /**
   * @swagger
   * /price:
   *   get:
   *     summary: Get list of all prices
   *     tags:
   *       - Price
   *     responses:
   *       200:
   *         description: List of prices retrieved successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: integer
   *                   example: 200
   *                 message:
   *                   type: string
   *                   example: Success
   *                 data:
   *                   type: array
   *                   items:
   *                     $ref: '#/components/schemas/Price'
   *       404:
   *         description: No prices found
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: integer
   *                   example: 404
   *                 message:
   *                   type: string
   *                   example: Not found
   *       500:
   *         description: Internal Server Error
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: integer
   *                   example: 500
   *                 message:
   *                   type: string
   *                   example: Interval Server Error
   */
   .get('/price', AUTH, price.GET)

   /**
    * @swagger
    * /price:
    *   post:
    *     summary: Add a new price plan
    *     tags:
    *       - Price
    *     requestBody:
    *       required: true
    *       content:
    *         application/json:
    *           schema:
    *             type: object
    *             required:
    *               - title_uz
    *               - title_ru
    *               - title_eng
    *               - period
    *               - price
    *               - sort_order
    *             properties:
    *               title_uz:
    *                 type: string
    *                 example: Oylik tarif
    *               title_ru:
    *                 type: string
    *                 example: Месячный тариф
    *               title_eng:
    *                 type: string
    *                 example: Monthly plan
    *               period:
    *                 type: integer
    *                 example: 30
    *               price:
    *                 type: integer
    *                 example: 150000
    *               sort_order:
    *                 type: integer
    *                 example: 1
    *     responses:
    *       201:
    *         description: Price added successfully
    *         content:
    *           application/json:
    *             schema:
    *               type: object
    *               properties:
    *                 status:
    *                   type: integer
    *                   example: 201
    *                 message:
    *                   type: string
    *                   example: Success
    *                 data:
    *                   $ref: '#/components/schemas/Price'
    *       400:
    *         description: Bad request (invalid or missing parameters)
    *         content:
    *           application/json:
    *             schema:
    *               type: object
    *               properties:
    *                 status:
    *                   type: integer
    *                   example: 400
    *                 message:
    *                   type: string
    *                   example: Bad request
    *       500:
    *         description: Internal Server Error
    *         content:
    *           application/json:
    *             schema:
    *               type: object
    *               properties:
    *                 status:
    *                   type: integer
    *                   example: 500
    *                 message:
    *                   type: string
    *                   example: Interval Server Error
    */
   .post('/price', AUTH, price.ADD_PRICE)

   /**
    * @swagger
    * /price:
    *   put:
    *     summary: Edit an existing price plan
    *     tags:
    *       - Price
    *     requestBody:
    *       required: true
    *       content:
    *         application/json:
    *           schema:
    *             type: object
    *             required:
    *               - id
    *               - title_uz
    *               - title_ru
    *               - title_eng
    *               - period
    *               - price
    *               - sort_order
    *             properties:
    *               id:
    *                 type: integer
    *                 example: 1
    *               title_uz:
    *                 type: string
    *                 example: Yangi tarif
    *               title_ru:
    *                 type: string
    *                 example: Новый тариф
    *               title_eng:
    *                 type: string
    *                 example: New Plan
    *               period:
    *                 type: integer
    *                 example: 90
    *               price:
    *                 type: integer
    *                 example: 350000
    *               sort_order:
    *                 type: integer
    *                 example: 2
    *     responses:
    *       200:
    *         description: Price updated successfully
    *         content:
    *           application/json:
    *             schema:
    *               type: object
    *               properties:
    *                 status:
    *                   type: integer
    *                   example: 200
    *                 message:
    *                   type: string
    *                   example: Success
    *                 data:
    *                   $ref: '#/components/schemas/Price'
    *       400:
    *         description: Bad request
    *         content:
    *           application/json:
    *             schema:
    *               type: object
    *               properties:
    *                 status:
    *                   type: integer
    *                   example: 400
    *                 message:
    *                   type: string
    *                   example: Bad request
    *       500:
    *         description: Internal Server Error
    *         content:
    *           application/json:
    *             schema:
    *               type: object
    *               properties:
    *                 status:
    *                   type: integer
    *                   example: 500
    *                 message:
    *                   type: string
    *                   example: Interval Server Error
    */
   .put('/price', AUTH, price.EDIT_PRICE)

   /**
    * @swagger
    * /price:
    *   delete:
    *     summary: Delete a price by ID
    *     tags:
    *       - Price
    *     requestBody:
    *       required: true
    *       content:
    *         application/json:
    *           schema:
    *             type: object
    *             required:
    *               - id
    *             properties:
    *               id:
    *                 type: integer
    *                 example: 1
    *     responses:
    *       200:
    *         description: Price deleted successfully
    *         content:
    *           application/json:
    *             schema:
    *               type: object
    *               properties:
    *                 status:
    *                   type: integer
    *                   example: 200
    *                 message:
    *                   type: string
    *                   example: Success
    *                 data:
    *                   type: object
    *                   description: Deleted price data
    *       400:
    *         description: Bad request
    *         content:
    *           application/json:
    *             schema:
    *               type: object
    *               properties:
    *                 status:
    *                   type: integer
    *                   example: 400
    *                 message:
    *                   type: string
    *                   example: Bad request
    *       500:
    *         description: Internal Server Error
    *         content:
    *           application/json:
    *             schema:
    *               type: object
    *               properties:
    *                 status:
    *                   type: integer
    *                   example: 500
    *                 message:
    *                   type: string
    *                   example: Interval Server Error
    */
   .delete('/price', AUTH, price.DELETE_PRICE)

module.exports = router