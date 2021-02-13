import React from 'react';

class RulesContainer extends React.Component {
  render() {
    return (
      <div className="m-3">
        <h1>Regulamento</h1>
        <hr />

        <p>
          Não pagaremos jogos: já realizados e que por falha, continuem no
          sistema, por erro de hora ou por jogos antecipados. No caso de
          casadinhas, serão calculados os valores, e o jogo não realizado será
          devolvido o valor pago, sendo pagos apenas os jogos realizados com
          sucesso.
        </p>
        <p>
          Combinações com dois jogos ou mais, se forem adiados ou cancelados,
          receberá o valor dos jogos.
        </p>
        <p>
          Nas demais opções de aposta, jogos adiados ou cancelados são esperados
          até 48 hs.
        </p>
        <p>
          Todos os jogos são definidos ao final dos 90 minutos de jogo,
          incluindo acréscimos definidos pelo árbitro. Não valerá prorrogação,
          nem disputa de pênaltis.
        </p>
        <p>
          Quando o jogo não alcançar o final do tempo regulamentar, independente
          do tempo transcorrido será considerado o jogo adiado e cancelada a
          cotação automaticamente.
        </p>
        <p>
          Uma aposta será cancelada se a partida não for concluída. Com ressalva
          da federação responsável se pronunciar em até 24hs. Os valores
          apostados serão devolvidos com decrescimo da comissão cambista.
        </p>
        <p>
          Quando a integridade de um evento esportivo for comprometida, a
          empresa reserva o direito de anular qualquer aposta (incluidas apostas
          multiplas) associada a este evento os valores apostados serão
          devolvidos com decrescimo da comissão do cambista.
        </p>
        <p>
          Os clientes não podem cancelar ou mudar uma aposta uma vez que tenha
          sido efetuada e aceitação confirmada.
        </p>
        <p>
          Todas as cotações estão sujeitas a variação e seráo fixadas no momento
          em que uma aposta for feita. a empresa não é responsável por nenhum
          tipo de erro humano que nos leve a erros ou omissões incluindo
          anuncios, publicacão, mercado de cotações ou resultados diferentes dos
          corretos ou ainda a aceitação de apostas que contrariem as regras.
          Caso uma aposta tenha sido aceita com uma cotação incorreta, a empresa
          reserva o direito de anular esta aposta.
        </p>
        <p>
          A empresa não pode ser responsabilizada por qualquer erro de digitação
          humano de terceiros (mercado de cotação) ou qualquer erro tangivel em
          relação a qualquer produto ou informação disponibilizada. A empresa
          reserva o direito de anular qualquer aposta que tenha acontecido sob
          as circunstancia que em considere eleitas ao seu julgamento que tais
          erros tenham acontecido.
        </p>
      </div>
    );
  }
}

export default RulesContainer;
