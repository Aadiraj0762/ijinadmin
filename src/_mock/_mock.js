import { sub } from 'date-fns';
//
import {
    age,
    boolean,
    company,
    country,
    description,
    email,
    firstName,
    fullAddress,
    fullName,
    lastName,
    percent,
    phoneNumber,
    price,
    rating,
    role,
    sentence,
    title,
} from './assets';

// ----------------------------------------------------------------------

const _mock = {
  id: (index) => `e99f09a7-dd88-49d5-b1c8-1daf80c2d7b${index + 1}`,
  email: (index) => email[index],
  phoneNumber: (index) => phoneNumber[index],
  time: (index) => sub(new Date(), { days: index, hours: index }),
  boolean: (index) => boolean[index],
  role: (index) => role[index],
  company: (index) => company[index],
  address: {
    fullAddress: (index) => fullAddress[index],
    country: (index) => country[index],
  },
  name: {
    firstName: (index) => firstName[index],
    lastName: (index) => lastName[index],
    fullName: (index) => fullName[index],
  },
  text: {
    title: (index) => title[index],
    sentence: (index) => sentence[index],
    description: (index) => description[index],
  },
  number: {
    percent: (index) => percent[index],
    rating: (index) => rating[index],
    age: (index) => age[index],
    price: (index) => price[index],
  },
  image: {
    cover: (index) =>
      `https://api-dev-Minimall-v4.vercel.app/assets/images/covers/cover_${index + 1}.jpg`,
    product: (index) =>
      `https://api-dev-Minimall-v4.vercel.app/assets/images/products/product_${index + 1}.jpg`,
    avatar: (index) =>
      `https://api-dev-Minimall-v4.vercel.app/assets/images/avatars/avatar_${index + 1}.jpg`,
  },
};

export default _mock;
