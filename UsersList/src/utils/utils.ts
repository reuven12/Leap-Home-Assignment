import axios from 'axios';
import config from '../config';
import { ServerError, NotFoundError } from '../utils/errors/errorTypes';
import { User } from '../interfaces/users.interface';
import { FetchBy } from '../interfaces/users.interface';
import { UserEntity } from '../db/users.entity';
import cors from 'cors';

export const allowedOrigins = [
  "http://localhost:3000",
  "https://www.google.com",
  "https://www.facebook.com",
];
export const corsOptions: cors.CorsOptions = {
  origin: allowedOrigins,
};

export const fetchExternalUsers = async (
  id: number,
  fetchUsersBy: FetchBy
): Promise<User[] | User | undefined> => {
  try {
    if (fetchUsersBy === FetchBy.PAGE) {
      return (await axios.get(`${config.externalUsersApi.url}?page=${id}`)).data
        .data;
    } else if (fetchUsersBy === FetchBy.ID) {
      return (await axios.get(`${config.externalUsersApi.url}/${id}`)).data;
    }
  } catch (error: any) {
    if (error.response.status === 404)
      throw new NotFoundError('User not found');
    throw new ServerError();
  }
};

export const generateUser = (user: User): UserEntity => {
  const userEntity = new UserEntity();
  userEntity.first_name = user.first_name;
  userEntity.last_name = user.last_name;
  userEntity.email = user.email;
  userEntity.avatar = user.avatar;
  return userEntity;
};


import Joi from 'joi';

const userSchema = Joi.object({
  id: Joi.string().required(),
  name: Joi.string().required(),
});

const createUserSchema = Joi.alternatives().try(
  Joi.array().items(userSchema), // אם זו רשימה של משתמשים
  userSchema // אם זה משתמש יחיד
).custom((value) => {
  // אם הערך הוא אובייקט יחיד, עוטפים אותו במערך
  return Array.isArray(value) ? value : [value];
}, 'Wrap single user in an array');

export const validateCreateUsers = (req, res, next) => {
  const { error, value } = createUserSchema.validate(req.body);

  if (error) {
    return res.status(400).json({ error: error.message });
  }

  req.body = value; // מעדכנים את ה-body לאחר הלידציה
  next();
};


console.log(sortedExtendedItems);




interface Component {
  id: string;
  name: string;
  isLinkedToPerson?: boolean; // שדה לסימון אם הרכיב מקושר
}

interface Asset {
  id: string;
  components: Component[];
  hasLinkedComponent?: boolean; // שדה לסימון אם יש רכיבים תואמים
}

// מערך הנכסים
const assets: Asset[] = [
  { id: 'asset1', components: [{ id: 'comp1', name: 'Component 1' }, { id: 'comp2', name: 'Component 2' }] },
  { id: 'asset2', components: [{ id: 'comp3', name: 'Component 3' }] },
  { id: 'asset3', components: [{ id: 'comp4', name: 'Component 4' }] },
];

// מערך מזהי רכיבים
const componentIds: string[] = ['comp2', 'comp4'];

// עיבוד ראשוני
const processedAssets = assets.map(asset => {
  const updatedComponents = asset.components.map(component => {
    const isLinked = componentIds.includes(component.id); // בודקים אם הרכיב מקושר
    return { ...component, isLinkedToPerson: isLinked };
  });

  const hasLinkedComponent = updatedComponents.some(component => component.isLinkedToPerson);

  return { ...asset, components: updatedComponents, hasLinkedComponent };
});

// פונקציית מיון כללית
const sortAssets = (assetsToSort: Asset[]) =>
  assetsToSort.sort((a, b) => {
    if (a.hasLinkedComponent && !b.hasLinkedComponent) return -1;
    if (!a.hasLinkedComponent && b.hasLinkedComponent) return 1;
    return 0;
  });

// חיפוש ומיון מחדש
const searchAndSortAssets = (query: string) => {
  const filteredAssets = processedAssets.filter(asset =>
    asset.components.some(component => component.name.toLowerCase().includes(query.toLowerCase()))
  );

  return sortAssets(filteredAssets);
};

// דוגמה לחיפוש
const searchQuery = 'Component 2';
const searchResults = searchAndSortAssets(searchQuery);

console.log(searchResults);

