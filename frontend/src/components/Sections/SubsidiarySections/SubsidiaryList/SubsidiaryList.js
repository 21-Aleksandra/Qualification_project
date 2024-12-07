import { observer } from "mobx-react-lite";
import { Context } from "../../../../index";
import { Row, Col } from "react-bootstrap";
import React, { useContext } from "react";
import SubsidiaryListItem from "../SubsidiaryListItem/SubsidiaryListItem";

const SubsidiaryList = observer(
  ({ selectedSubsidiaries, onCheckboxChange }) => {
    const { subsidiary } = useContext(Context);
    const currentSubsidiaries = subsidiary.currentSubsidiaries;

    return (
      <div>
        <Row className="d-flex g-3">
          {currentSubsidiaries.map((subsidiaryItem) => (
            <Col key={subsidiaryItem.id} xs={12} sm={6} md={4} lg={4}>
              <SubsidiaryListItem
                subsidiary={subsidiaryItem}
                onCheckboxChange={onCheckboxChange}
                isSelected={selectedSubsidiaries?.includes(subsidiaryItem.id)}
              />
            </Col>
          ))}
        </Row>
      </div>
    );
  }
);
export default SubsidiaryList;
