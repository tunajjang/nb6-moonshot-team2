import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Moonshot Team2 API',
      version: '1.0.0',
      description: 'Moonshot 프로젝트 API 문서 입니다.',
    },
    servers: [{ url: 'http://localhost:3000' }],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  apis: ['./src/routers/*.ts', './src/routers/**/*.ts'],
};

export const specs = swaggerJsdoc(options);
