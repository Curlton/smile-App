import React, { useContext } from "react";
import { Outlet, Link, useNavigate, useLocation } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import logo from "../assets/Smile_logo2.png";
import { Container, Row, Col, Accordion, Nav, Button } from "react-bootstrap";

const DashboardLayout = () => {
  const { user, loading, setUser } = useContext(UserContext);
  const navigate = useNavigate();
  const location = useLocation();

  const logout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    localStorage.removeItem("role");
    setUser(null);
    navigate("/login");
  };

  if (loading) {
    return <p>Loading user data...</p>;
  }

  if (!user) {
    // If no user info (maybe logged out), redirect to login
    navigate("/login");
    return null;
  }

  const isActive = (path) => location.pathname === path;

  const defaultActiveKey =
    location.pathname.startsWith("/children")
      ? "0"
      : location.pathname.startsWith("/programs")
      ? "1"
      : location.pathname.startsWith("/childprogram")
      ? "2"
      : location.pathname.startsWith("/sponsors")
      ? "3"
      : location.pathname.startsWith("/donations")
      ? "4"
      : location.pathname.startsWith("/staff")
      ? "5"
      : null;

  // Determine roles (you can adjust this logic if you want)
  const isAdmin = user.role === "admin" || user.is_superuser;
  const isManager = user.role === "manager";
  const isViewer = user.role === "viewer";

  return (
    <Container fluid>
      {/* Header */}
      <Row className="bg-primary text-white p-3 align-items-center">
        <Col xs="auto">
          <img
            src={logo}
            alt="SmileApp Logo"
            style={{ height: "80px", width: "auto" }}
            className="img-fluid"
          />
        </Col>
        <Col className="d-flex justify-content-center">
          <h3
            className="mb-0"
            style={{
              fontFamily: "'Georgia', serif",
              fontWeight: "bold",
              fontStyle: "italic",
            }}
          >
            Welcome to the SmilePortal
          </h3>
        </Col>
        <Col xs="auto" className="text-end">
          {user.username && (
            <>
              <div>
                Hello, <strong>{user.username}</strong>
              </div>
              <Button size="sm" variant="light" className="mt-1" onClick={logout}>
                Logout
              </Button>
            </>
          )}
        </Col>
      </Row>

      {/* Layout */}
      <Row style={{ minHeight: "90vh" }}>
        {/* Sidebar */}
        <Col md={2} className="bg-light border-end pt-3">
          <h5 className="px-2">MENU</h5>
          <Accordion defaultActiveKey={defaultActiveKey}>
            {/* Children: accessible to manager & admin */}
            {(isAdmin || isManager) && (
              <Accordion.Item eventKey="0">
                <Accordion.Header>👶 Children</Accordion.Header>
                <Accordion.Body className="px-2">
                  <Nav className="flex-column">
                    <Nav.Link as={Link} to="/children/add" active={isActive("/children/add")}>
                      ➕ Add Child
                    </Nav.Link>
                    <Nav.Link as={Link} to="/children" active={isActive("/children")}>
                      📄 All Children
                    </Nav.Link>
                  </Nav>
                </Accordion.Body>
              </Accordion.Item>
            )}

            {/* Programs: accessible to manager & admin */}
            {(isAdmin || isManager) && (
              <Accordion.Item eventKey="1">
                <Accordion.Header>📚 Programs</Accordion.Header>
                <Accordion.Body className="px-2">
                  <Nav className="flex-column">
                    <Nav.Link as={Link} to="/programs/add" active={isActive("/programs/add")}>
                      ➕ Add Program
                    </Nav.Link>
                    <Nav.Link as={Link} to="/programs/list" active={isActive("/programs/list")}>
                      📄 All Programs
                    </Nav.Link>
                  </Nav>
                </Accordion.Body>
              </Accordion.Item>
            )}

            {/* Child Programs: accessible to manager & admin */}
            {(isAdmin || isManager) && (
              <Accordion.Item eventKey="2">
                <Accordion.Header>👥 Child Programs</Accordion.Header>
                <Accordion.Body className="px-2">
                  <Nav className="flex-column">
                    <Nav.Link as={Link} to="/childprogram/add" active={isActive("/childprogram/add")}>
                      ➕ Add Child Program
                    </Nav.Link>
                    <Nav.Link as={Link} to="/childprogram/list" active={isActive("/childprogram/list")}>
                      📄 All Child Programs
                    </Nav.Link>
                  </Nav>
                </Accordion.Body>
              </Accordion.Item>
            )}

            {/* Sponsors: admin only */}
            {isAdmin && (
              <Accordion.Item eventKey="3">
                <Accordion.Header>👥 Sponsors</Accordion.Header>
                <Accordion.Body className="px-2">
                  <Nav className="flex-column">
                    <Nav.Link as={Link} to="/sponsors/add" active={isActive("/sponsors/add")}>
                      ➕ Add Sponsor
                    </Nav.Link>
                    <Nav.Link as={Link} to="/sponsors/list" active={isActive("/sponsors/list")}>
                      📄 All Sponsors
                    </Nav.Link>
                  </Nav>
                </Accordion.Body>
              </Accordion.Item>
            )}

            {/* Donations: admin only */}
            {isAdmin && (
              <Accordion.Item eventKey="4">
                <Accordion.Header>💰 Donations</Accordion.Header>
                <Accordion.Body className="px-2">
                  <Nav className="flex-column">
                    <Nav.Link as={Link} to="/donations/add" active={isActive("/donations/add")}>
                      ➕ Add Donation
                    </Nav.Link>
                    <Nav.Link as={Link} to="/donations/list" active={isActive("/donations/list")}>
                      📄 All Donations
                    </Nav.Link>
                  </Nav>
                </Accordion.Body>
              </Accordion.Item>
            )}

            {/* Staff: admin only */}
            {isAdmin && (
              <Accordion.Item eventKey="5">
                <Accordion.Header>👔 Staff</Accordion.Header>
                <Accordion.Body className="px-2">
                  <Nav className="flex-column">
                    <Nav.Link as={Link} to="/staff" active={isActive("/staff")}>
                      📄 Staff List
                    </Nav.Link>
                    <Nav.Link as={Link} to="/staff/add" active={isActive("/staff/add")}>
                      ➕ Add Staff
                    </Nav.Link>
                  </Nav>
                </Accordion.Body>
              </Accordion.Item>
            )}

            {/* Viewers can only see child/program lists read-only */}
            {isViewer && (
              <>
                <Accordion.Item eventKey="0">
                  <Accordion.Header>👶 Children</Accordion.Header>
                  <Accordion.Body className="px-2">
                    <Nav className="flex-column">
                      <Nav.Link as={Link} to="/children" active={isActive("/children")}>
                        📄 All Children
                      </Nav.Link>
                    </Nav>
                  </Accordion.Body>
                </Accordion.Item>

                <Accordion.Item eventKey="1">
                  <Accordion.Header>📚 Programs</Accordion.Header>
                  <Accordion.Body className="px-2">
                    <Nav className="flex-column">
                      <Nav.Link as={Link} to="/programs/list" active={isActive("/programs/list")}>
                        📄 All Programs
                      </Nav.Link>
                    </Nav>
                  </Accordion.Body>
                </Accordion.Item>

                <Accordion.Item eventKey="2">
      <Accordion.Header>👥 Child Programs</Accordion.Header>
      <Accordion.Body className="px-2">
        <Nav className="flex-column">
          <Nav.Link as={Link} to="/childprogram/list" active={isActive("/childprogram/list")}>
            📄 All Child Programs
          </Nav.Link>
        </Nav>
      </Accordion.Body>
    </Accordion.Item>
              </>
            )}
          </Accordion>
        </Col>

        {/* Main Content */}
        <Col md={10} className="p-4 bg-white">
          <Outlet />
        </Col>
      </Row>
    </Container>
  );
};

export default DashboardLayout;
