import {fetchObat} from '@/services/obat';
import {fetchUsers, fetchUsersId, fetchUsersAdd, fetchUsersEdit, fetchUsersDelete} from '@/services/users';
import {login, logout} from '@/services/auth';
import {api} from '@/services/api';

export {
    api,
    fetchObat, 
    login,
    logout,
    fetchUsers,
    fetchUsersId,
    fetchUsersAdd,
    fetchUsersDelete,
    fetchUsersEdit
}

