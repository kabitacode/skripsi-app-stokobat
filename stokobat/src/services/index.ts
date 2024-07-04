import {fetchUsers, fetchUsersId, fetchUsersAdd, fetchUsersEdit, fetchUsersDelete} from '@/services/users';
import {fetchObat, fetchObatId, fetchObatAdd, fetchObatEdit, fetchObatDelete} from '@/services/obat';
import {fetchKategori, fetchKategoriId, fetchKategoriAdd, fetchKategoriEdit, fetchKategoriDelete} from '@/services/kategori';
import {login, logout} from '@/services/auth';
import {api} from '@/services/api';

export {
    api,
    login,
    logout,
    
    fetchUsers,
    fetchUsersId,
    fetchUsersAdd,
    fetchUsersDelete,
    fetchUsersEdit,

    fetchObat,
    fetchObatId,
    fetchObatAdd,
    fetchObatEdit,
    fetchObatDelete,

    fetchKategori,
    fetchKategoriId,
    fetchKategoriAdd,
    fetchKategoriEdit,
    fetchKategoriDelete
}

