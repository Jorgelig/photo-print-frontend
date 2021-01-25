import React, { useState, useEffect } from "react";
import { Modal } from "antd";
import YandexMap from "../departments/Department";
import SearchIcon from "./search-icon-2.png";
import CloseIcon from "./close.svg";
import "./style.css";

interface ModalProps {
  isVisible: boolean;
  onOk: () => void;
  onCancel: () => void;
  title: string;
}

export const DepartmentModal = (props: ModalProps) => {
  const [searchValue, setSearchValue] = useState<string>("");

  return (
    <Modal
      title={<p className="department-modal-title">{props.title}</p>}
      visible={props.isVisible}
      onOk={props.onOk}
      onCancel={props.onCancel}
      footer={null}
      style={{ minHeight: 620 }}
      closeIcon={<img src={CloseIcon} />}
    >
      <div className="search-input-modal">
        <i className="search-icon-modal">
          <img src={SearchIcon} />
        </i>
        <input
          className="search-input-field-modal"
          placeholder="Введите адрес"
          value={searchValue}
          onChange={(event) => {
            setSearchValue(event.target.value);
          }}
        />
      </div>
      <div style={{ marginTop: 15, height: 460 }}>
        <YandexMap />
      </div>
    </Modal>
  );
};
