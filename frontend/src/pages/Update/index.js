import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Form, Input } from '@rocketseat/unform';
import { MdAddCircleOutline } from 'react-icons/md';
import ArquivoInput from './ArquivoInput';
import { Container, Content } from './styles';
import { updateMeetupRequest } from '~/store/modules/meetup/actions';

import ReactDatePicker from './ReactDatePicker';

export default function Update() {
  const dispatch = useDispatch();
  const data = useSelector(state => state.meetup);

  function handleSubmitUpdate(dataForm) {
    const dataUpdate = dataForm;
    dataUpdate.date = new Date(dataForm.date);

    dispatch(updateMeetupRequest({ dataUpdate, data }));
  }

  return (
    <Container>
      <Content>
        <Form initialData={data} onSubmit={handleSubmitUpdate}>
          <ArquivoInput name="id_arquivo" />

          <Input name="title" placeholder="Titulo" />

          <Input multiline name="descricao" placeholder="Descrição completa" />

          <ReactDatePicker name="date" />

          <Input name="localizacao" placeholder="Localização" />

          <button type="submit">
            <MdAddCircleOutline size={20} color="#fff" />
            Salvar meetup
          </button>
        </Form>
      </Content>
    </Container>
  );
}
