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


<div class="dropdown-container" [ngClass]="customClass">
  <div class="dropdown-row" *ngFor="let item of items">
    <span class="row-title">{{ item.title }}</span>
    <span class="row-value">{{ item.value }}</span>
  </div>
</div>

  @Component({
  selector: 'app-dropdown',
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.less']
})
export class DropdownComponent {
  @Input() customClass: string = ''; // מחלקה מותאמת אישית
}



<div class="dropdown-container" [ngClass]="customClass">
  <div class="dropdown-row" *ngFor="let item of items">
    <span class="row-title">{{ item.title }}</span>
    <span class="row-value">{{ item.value }}</span>
  </div>
</div>


  
.dropdown-container {
  .dropdown-row {
    display: flex;
    justify-content: space-between;
    padding: 10px;
    background-color: #f9f9f9; // צבע ברירת מחדל לשורה
    color: black;

    &:hover {
      background-color: #e0e0e0; // צבע ברירת מחדל ב-hover
    }

    &.active {
      background-color: #d0d0d0; // צבע ברירת מחדל בלחיצה
    }
  }

  // עיצוב מותאם אישית
  &.custom-theme {
    .dropdown-row {
      background-color: #fff5f5;
      color: red;

      &:hover {
        background-color: #ffe5e5;
      }

      &.active {
        background-color: #ffcccc;
      }
    }
  }
}

<!-- דרופדאון עם העיצוב המותאם -->
<app-dropdown [customClass]="'custom-theme'" [items]="myItems"></app-dropdown>

<!-- דרופדאון עם עיצוב ברירת המחדל -->
<app-dropdown [items]="defaultItems"></app-dropdown>


<div class="dropdown-container" ng-class="dropdown.customClass">
  <div class="dropdown-row" 
       ng-repeat="item in dropdown.items" 
       ng-class="{'hover': dropdown.isHovered(item), 'active': dropdown.isActive(item)}">
    <span class="row-title">{{ item.title }}</span>
    <span class="row-value">{{ item.value }}</span>
  </div>
</div>

  

