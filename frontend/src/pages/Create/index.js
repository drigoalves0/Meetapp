import React from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { Form, Input } from '@rocketseat/unform';

import { MdAddCircleOutline } from 'react-icons/md';
import * as Yup from 'yup';
import ArquivoInput from './ArquivoInput';
import { Container, Content } from './styles';

import { createMeetupRequest } from '~/store/modules/meetup/actions';
import ReactDatePicker from './ReactDatePicker';

const schema = Yup.object().shape({
  title: Yup.string().required('Campo obrigatório'),
  descricao: Yup.string().required('Campo obrigatório'),
  date: Yup.date().required('Campo obrigatório'),
  localizacao: Yup.string().required('Campo obrigatório'),
  file_id: Yup.string().required('É obrigatório selecionar uma imagem'),
});

export default function FormData() {
  const dispatch = useDispatch();
  const data = useSelector(state => state.meetup);

  function handleSubmitNew(newData) {
    console.tron.log(newData);
    dispatch(createMeetupRequest(newData));
  }

  return (
    <Container>
      <Content>
        <Form schema={schema} initialData={data} onSubmit={handleSubmitNew}>
          <ArquivoInput name="file_id" />

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
