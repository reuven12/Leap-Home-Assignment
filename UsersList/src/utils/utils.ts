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


import { isEqual } from 'lodash';

export const createPersonGroupingInfoStream = ({
  personsStream,
  personsInfoStream,
  eventsMapStream,
  anticipationSourcesStream,
  confidenceLevelsStream,
  timeRangeStream
}: personGroupingUpstream): Observable<IPersonGroupingInformation[]> => {
  return combineLatest([
    personsStream.pipe(distinctUntilChanged(isEqual)),
    personsInfoStream.pipe(distinctUntilChanged(isEqual)),
    eventsMapStream.pipe(distinctUntilChanged(isEqual)),
    anticipationSourcesStream.pipe(distinctUntilChanged(isEqual)),
    confidenceLevelsStream.pipe(distinctUntilChanged()),
    timeRangeStream.pipe(distinctUntilChanged())
  ])
  .pipe(
    debounceTime(300), // מניעת עדכונים תכופים
    map(([persons, personsInformation, eventsMap, anticipationSources, confidenceLevelsToConsider, timeRange]) => {
      return persons.map(person => {
        const informationOfPerson = personsInformation.find(
          personInfo => personInfo.id === person.PersonId
        );
        const events: UnionPersonAnticipation[] = [];
        if (eventsMap) {
          console.log('eventsMap', eventsMap);
          events.push(...(eventsMap[person.PersonId] ?? []));
        }
        return {
          Person: person,
          PersonInformation: informationOfPerson,
          anticipations: events,
          anticipationSources,
          confidenceLevelsToConsider,
          timeRange
        };
      });
    }),
    distinctUntilChanged(isEqual) // השוואה עמוקה ברמת הפלט
  );
};

  
  
  
  
