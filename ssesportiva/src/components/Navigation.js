import React, { Component } from 'react';
import { Navbar, Nav, NavItem, NavDropdown, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faFutbol,
  faTicketAlt,
  faFileAlt,
  faKey,
} from '@fortawesome/free-solid-svg-icons';
import { isNull } from 'lodash';

const isValidUser = (auth, user) => {
  return auth && !auth.isEmpty && !isNull(user);
};

const isAdminUser = (auth, user) => {
  return isValidUser(auth, user) && user.admin;
};

class Navigation extends Component {
  constructor(props) {
    super(props);

    this.state = {
      expanded: false,
    };

    this.ref = React.createRef();
  }

  componentDidMount() {
    document.addEventListener('click', this.handleClick.bind(this));
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.handleClick.bind(this));
  }

  handleClick(e) {
    if (this.ref.current && !this.ref.current.contains(e.target)) {
      this.collapse();
    }
  }

  collapse() {
    this.setState({
      expanded: false,
    });
  }

  render() {
    const { auth, user } = this.props;

    return (
      <div ref={this.ref}>
        <Navbar
          expand="md"
          variant="dark"
          fixed="top"
          onToggle={() => this.setState({ expanded: !this.state.expanded })}
          expanded={this.state.expanded}
        >
          <Container fluid>
            <Navbar.Brand>
              <Link to="/" onClick={this.collapse.bind(this)}>
                <img src="/logo.png" height="27" alt="SS eSportiva" />
              </Link>
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav>
                <NavItem>
                  <Link
                    to="/"
                    onClick={this.collapse.bind(this)}
                    className="nav-link"
                  >
                    <FontAwesomeIcon icon={faFutbol} />
                    <span className="mx-2">Futebol</span>
                  </Link>
                </NavItem>

                <NavItem>
                  <Link
                    to="/conferir-bilhete"
                    onClick={this.collapse.bind(this)}
                    className="nav-link"
                  >
                    <FontAwesomeIcon icon={faTicketAlt} />
                    <span className="mx-2">Conferir Bilhete</span>
                  </Link>
                </NavItem>

                <NavItem>
                  <Link
                    to="/regulamento"
                    onClick={this.collapse.bind(this)}
                    className="nav-link"
                  >
                    <FontAwesomeIcon icon={faFileAlt} />
                    <span className="mx-2">Regulamento</span>
                  </Link>
                </NavItem>

                <NavDropdown.Divider />

                {isValidUser(auth, user) && (
                  <NavItem>
                    <Link
                      to="/buscar-aposta"
                      onClick={this.collapse.bind(this)}
                      className="nav-link"
                    >
                      <FontAwesomeIcon icon={faKey} />
                      <span className="mx-2">Aprovar Aposta</span>
                    </Link>
                  </NavItem>
                )}

                {isAdminUser(auth, user) && (
                  <NavItem>
                    <Link
                      to="/bilhetes-em-aberto"
                      onClick={this.collapse.bind(this)}
                      className="nav-link"
                    >
                      <FontAwesomeIcon icon={faKey} />
                      <span className="mx-2">Bilhetes em Aberto</span>
                    </Link>
                  </NavItem>
                )}

                <NavItem>
                  <Link
                    to="/acesso"
                    onClick={this.collapse.bind(this)}
                    className="nav-link"
                  >
                    <FontAwesomeIcon icon={faKey} />
                    <span className="mx-2">Acesso</span>
                  </Link>
                </NavItem>
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
      </div>
    );
  }
}

export default Navigation;
