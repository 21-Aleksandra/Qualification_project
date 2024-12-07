import React, { useContext } from "react";
import { Card, Badge, Tooltip, OverlayTrigger, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { Context } from "../../../../index";
import defaultImage from "../../../../assets/default_subsidiary.png";
import "./SubsidiaryListItem.css";
import { SUBSIDIARY_ITEM_ROUTE } from "../../../../utils/routerConsts";
import UserRoles from "../../../../utils/roleConsts";

const SubsidiaryListItem = ({ subsidiary, onCheckboxChange, isSelected }) => {
  const { user } = useContext(Context);
  const navigate = useNavigate();
  const serverUrl = process.env.REACT_APP_SERVER_URL || "";

  const bannerPhoto = subsidiary?.Photo_Set?.Photos?.find(
    (photo) => photo.isBannerPhoto
  )?.url
    ? `${serverUrl}${
        subsidiary.Photo_Set.Photos.find((photo) => photo.isBannerPhoto).url
      }`
    : defaultImage;

  const generatePath = (route, params) => {
    let path = route;
    Object.keys(params).forEach((key) => {
      path = path.replace(`:${key}`, params[key]);
    });
    return path;
  };

  const address = subsidiary?.Address || {};
  const mainOrganization = subsidiary?.Main_Organization || {};
  const missions = subsidiary?.Missions || [];
  const staffCount = subsidiary?.staffCount;

  const isManager = user.roles.includes(UserRoles.MANAGER);
  const handleCardClick = () => {
    navigate(generatePath(SUBSIDIARY_ITEM_ROUTE, { id: subsidiary.id }));
  };

  return (
    <Card className="subsidiary-card shadow-sm">
      <Card.Img
        variant="top"
        src={bannerPhoto}
        alt={subsidiary.name}
        className="subsidiary-card-img"
        onClick={handleCardClick}
      />

      <Card.Body className="subsidiary-card-body">
        <div className="subsidiary-card-section" onClick={handleCardClick}>
          <Card.Title className="subsidiary-card-title text-truncate">
            {subsidiary.name || "No name available"}
          </Card.Title>
        </div>

        <div className="subsidiary-card-section" onClick={handleCardClick}>
          {address.street || address.city || address.country ? (
            <Card.Text className="subsidiary-card-text text-muted">
              {address.street || "No street"}, {address.city || "No city"},
              {address.country || "No country"}
            </Card.Text>
          ) : (
            <Card.Text className="subsidiary-card-text text-muted">
              No address available
            </Card.Text>
          )}
        </div>

        <div className="subsidiary-card-section" onClick={handleCardClick}>
          {mainOrganization.name ? (
            <Card.Text className="text-muted">
              Part of: <strong>{mainOrganization.name}</strong>
            </Card.Text>
          ) : (
            <Card.Text className="text-muted">
              No main organization available
            </Card.Text>
          )}
        </div>

        <div className="subsidiary-card-section" onClick={handleCardClick}>
          {missions.length > 0 ? (
            <div className="d-flex flex-wrap gap-2">
              {missions.slice(0, 2).map((mission) => (
                <OverlayTrigger
                  key={mission.id}
                  overlay={<Tooltip>{mission.name}</Tooltip>}
                >
                  <Badge className="subsidiary-mission-badge text-truncate">
                    {mission.name}
                  </Badge>
                </OverlayTrigger>
              ))}
              {missions.length > 2 && (
                <Badge className="subsidiary-mission-badge text-truncate">
                  ...
                </Badge>
              )}
            </div>
          ) : (
            <Card.Text className="text-muted">No missions available</Card.Text>
          )}
        </div>

        <div className="subsidiary-card-section" onClick={handleCardClick}>
          <Card.Text className="text-muted">
            Staff Count:{" "}
            {staffCount != null ? staffCount : "No staff count available"}
          </Card.Text>
        </div>

        {isManager && (
          <div className="subsidiary-card-checkbox">
            <Form.Check
              type="checkbox"
              className="mt-3"
              checked={isSelected}
              onChange={(e) =>
                onCheckboxChange(subsidiary.id, e.target.checked)
              }
            />
          </div>
        )}
      </Card.Body>
    </Card>
  );
};

export default SubsidiaryListItem;
