import dotenv from "dotenv";
import mongoose from "mongoose";
import mqtt from 'mqtt';

// Handle uncaught exceptions
process.on("uncaughtException", (err) => {
  console.log("UNCAUGHT EXCEPTION! Shutting down...");
  console.log(err.name, err.message);
  process.exit(1);
});


dotenv.config({ path: "./config.env" });


import app from "./app.js";


const DB = process.env.DATABASE.replace(
  "<db_password>",
  process.env.DATABASE_PASSWORD
);

mongoose.connect(DB).then(() => console.log("DB connection successful!"));


const port = process.env.PORT || 8080;
console.log(process.env.NODE_ENV);
const server = app.listen(port, () => {
  console.log(`App running on port ${port}`);
});


const topic = 'sensorReadings';

const mqttOptions = {
  host: process.env.MQTT_HOST,
  port: 8883,
  protocol: 'mqtts',
  username: process.env.MQTT_USER,
  password: process.env.MQTT_PASSWORD
};

const client = mqtt.connect(mqttOptions);

client.on('connect', () => {
  console.log('Connected to MQTT broker');

  client.subscribe(topic, (err) => {
    if (err) {
      console.error('Failed to subscribe:', err);
    } else {
      console.log(`Subscribed to topic: ${topic}`);
    }
  });
});
//find if farm exists and then store data
//apiKey in body with readings
client.on("message", async (topic, message) => {
  try {
    const data = JSON.parse(message.toString());

    const { apiKey, temperature, humidity, moisture, region, pH, } = data;
    if(!apiKey){
      return;
    }
    const farm = await Farm.findFarmByApiKey(apiKey);
    console.log(farm)
    if (!farm) {
      console.error("Invalid API key: Farm not found");
      return;
    }

    await SensorReading.create({
      farm: farm._id,
      temperature,
      humidity,
      moisture,
      region,
      pH,
      Diseases,
      isRipe,
    });

    console.log("Sensor reading saved");
  } catch (err) {
    console.error("Error processing MQTT message:", err.message);
  }
});

client.on('error', (err) => {
  console.error('MQTT error:', err);
});


process.on("unhandledRejection", (err) => {
  console.log("UNHANDLED REJECTION! Shutting down...");
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});


process.on("SIGTERM", () => {
  console.log("👋 SIGTERM RECEIVED. Shutting down gracefully");
  server.close(() => {
    console.log("💥 Process terminated!");
  });
});
