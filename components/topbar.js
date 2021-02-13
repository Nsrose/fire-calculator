
import React from "react";
import Link from 'next/link'
import { Navbar, Nav, NavDropdown, Form, FormControl, Button } from 'react-bootstrap';
import styles from 'bootstrap/dist/css/bootstrap.min.css';


export default class TopBar extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return <Navbar bg="dark" expand="lg" variant="dark" fixed='top'>
  <Link href="/" passHref><Navbar.Brand>FIRE Calculator</Navbar.Brand></Link>
  <Navbar.Toggle aria-controls="basic-navbar-nav" />
  <Navbar.Collapse id="basic-navbar-nav">
    <Nav className="mr-auto">
      <Link href="/" passHref><Nav.Link>Home</Nav.Link></Link>
      {/* <Link href="/about" passHref><Nav.Link>About</Nav.Link></Link> */}
      <NavDropdown title="Resources" id="basic-nav-dropdown">
        <NavDropdown.Item href="https://reddit.com/r/fire" target="_blank">Reddit: FIRE</NavDropdown.Item>
        <NavDropdown.Item href="https://reddit.com/r/fatfire" target="_blank">Reddit: FatFIRE</NavDropdown.Item>
        <NavDropdown.Divider />
        <NavDropdown.Item href="https://www.bankrate.com/calculators/mortgages/mortgage-calculator.aspx" target="_blank">Mortgage Calculator</NavDropdown.Item>
      </NavDropdown>
    </Nav>
    {/* <Form inline>
      <FormControl type="text" placeholder="Search" className="mr-sm-2" />
      <Button variant="outline-success">Search</Button>
    </Form>

  */}
  </Navbar.Collapse>
</Navbar>
	}


}