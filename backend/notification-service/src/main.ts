import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Eureka } from 'eureka-js-client';

async function bootstrap() {
  const port = parseInt(process.env.PORT || '3000');
  const app = await NestFactory.create(AppModule);
  await app.listen(port);

  // Khởi tạo Eureka client
  const client = new Eureka({
    instance: {
      app: 'notification-service',
      hostName: 'localhost',
      ipAddr: 'localhost',
      port: {
        $: port,
        '@enabled': true,
      },
      vipAddress: 'notification-service',
      dataCenterInfo: {
        '@class': 'com.netflix.appinfo.InstanceInfo$DefaultDataCenterInfo',
        name: 'MyOwn',
      },
    },
    eureka: {
      host: 'localhost',
      port: 8761,
      servicePath: '/eureka/apps/',
    },
  });

  client.start((err) => {
    if (err) {
      console.error('Eureka registration failed:', err);
    } else {
      console.log('Eureka registration success');
    }
  });
}
bootstrap();
