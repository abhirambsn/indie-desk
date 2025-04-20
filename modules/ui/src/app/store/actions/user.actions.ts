import { createAction, props } from "@ngrx/store";

export const loadUsers = createAction('[USER] Load Users', props<{ payload: any }>());
export const loadUsersSuccess = createAction('[USER] Load Users Success', props<{ payload: any }>());
export const loadUsersFailure = createAction('[USER] Load Users Failure', props<{ error: any }>());

export const saveUser = createAction('[USER] Save User', props<{ payload: any }>());
export const saveUserSuccess = createAction('[USER] Save User Success', props<{ payload: any }>());
export const saveUserFailure = createAction('[USER] Save User Failure', props<{ error: any }>());

export const updateUser = createAction('[USER] Update User', props<{ payload: any }>());

export const deleteUser = createAction('[USER] Delete User', props<{ payload: any }>());
export const deleteUserSuccess = createAction('[USER] Delete User Success', props<{ payload: any }>());
export const deleteUserFailure = createAction('[USER] Delete User Failure', props<{ error: any }>());
