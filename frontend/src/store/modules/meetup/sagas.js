import { call, put, all, takeLatest } from 'redux-saga/effects';
import { toast } from 'react-toastify';

import api from '~/services/api';

import {
  meetupSelected,
  updateMeetupSuccess,
  createMeetupSuccess,
  cancelMeetupSuccess,
} from './actions';

import history from '~/services/history';

function* updateMeetupRequest({ payload }) {
  try {
    const {
      title,
      descricao,
      date,
      localizacao,
      id_arquivo,
    } = payload.data.dataUpdate;

    const meetupData = payload.data.data;
    console.log(meetupData);
    const response = yield call(api.put, `meetup/${meetupData.id}`, {
      title,
      descricao,
      date,
      localizacao,
      id_arquivo,
    });

    yield put(updateMeetupSuccess(response.data));
  } catch (err) {
    toast.error('Falha na atualização dos dados, favor verifique novamente.');
  }
}

// function updateSuccess({ meetup }) {
function updateSuccess() {
  // const response = yield call(api.get, `meetups/${meetup.id}`);

  // yield put(meetupSelected(response.data));
  toast.success(
    'Meetup atualizado com sucesso. Você será redirecionado para a Dashboard'
  );

  setTimeout(function() {
    history.push('/dashboard');
  }, 3000);
}

function* createMeetupRequest({ payload }) {
  try {
    const { title, descricao, date, localizacao, file_id } = payload.data;

    const response = yield call(api.post, `meetup`, {
      title,
      descricao,
      date,
      localizacao,
      id_arquivo: file_id,
    });

    yield put(createMeetupSuccess(response.data));
    toast.success('Meetup criado com sucesso.');
  } catch (err) {
    console.log({ err });
    toast.error('Falha na atualização dos dados, favor verifique novamente.');
  }
}

function* createSuccess({ meetup }) {
  yield put(meetupSelected(meetup));

  setTimeout(function() {
    history.push('/dashboard');
  }, 3000);
}

function* cancelMeetupRequest({ payload }) {
  const { id } = payload;

  try {
    yield call(api.delete, `meetup/${id}`);
    history.push('/dashboard');
    yield put(cancelMeetupSuccess());

    toast.success('Meetup cancelado com sucesso.');
  } catch (err) {
    toast.error('Falha ao cancelar, favor verifique novamente.');
  }
}

export default all([
  takeLatest('@meetup/UPDATE_MEETUP_REQUEST', updateMeetupRequest),
  takeLatest('@meetup/UPDATE_MEETUP_SUCCESS', updateSuccess),

  takeLatest('@meetup/CREATE_MEETUP_REQUEST', createMeetupRequest),
  takeLatest('@meetup/CREATE_MEETUP_SUCCESS', createSuccess),

  takeLatest('@meetup/CANCEL_MEETUP_REQUEST', cancelMeetupRequest),
]);
