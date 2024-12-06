import { Cloudinary } from '@cloudinary/url-gen';

const cloudinaryConfig = {
  cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME,
  uploadPreset: import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET,
  apiKey: import.meta.env.VITE_CLOUDINARY_API_KEY
};

// Initialize Cloudinary instance
const cld = new Cloudinary({
  cloud: {
    cloudName: cloudinaryConfig.cloudName
  },
  url: {
    secure: true // force https
  }
});

export { cld, cloudinaryConfig };
