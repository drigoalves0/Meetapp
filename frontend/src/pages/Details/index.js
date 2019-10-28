import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { IoMdCalendar } from 'react-icons/io';
import { MdLocationOn, MdEdit, MdDeleteForever } from 'react-icons/md';
import { cancelMeetupRequest } from '~/store/modules/meetup/actions';
import { Container, Content } from './styles';

export default function Details() {
  const data = useSelector(state => state.meetup);

  const dispatch = useDispatch();

  function handleCancelMeetup(id) {
    dispatch(cancelMeetupRequest(id));
  }

  return (
    <Container>
      <Content>
        <div className="meetupHeader">
          <strong>{data.title}</strong>
          <div>
            <Link to="/meetup/update">
              <button className="editButton" type="button">
                <MdEdit size={20} color="#fff" />
                <span>Editar</span>
              </button>
            </Link>

            <button
              onClick={() => handleCancelMeetup(data.id)}
              className="cancelButton"
              type="button"
            >
              <MdDeleteForever size={20} color="#fff" />
              Cancelar
            </button>
          </div>
        </div>

        <div className="descriptionDiv">
          <div id="backgroundBanner">
            <img src={data.Arquivo.url} alt="Meetup Banner" />
          </div>
        </div>
        <strong id="description">{data.descricao}</strong>
        <div id="dateLocation">
          <span>
            <IoMdCalendar />
            {data.dateFormatted}
          </span>

          <span>
            <MdLocationOn />
            {data.localizacao}
          </span>
        </div>
      </Content>
    </Container>
  );
}
