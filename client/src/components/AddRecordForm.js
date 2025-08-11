import React, { useState } from "react";
import {
  Button,
  Modal,
  Form,
  Input,
  InputNumber,
  DatePicker,
  Row,
  Col,
  Select,
  notification,
} from "antd";
import dayjs from "dayjs";

export const AddRecordForm = ({ onSubmit, setIsModalOpen }) => {
  const [form] = Form.useForm();
  const [items, setItems] = useState([]);
  const [itemForm] = Form.useForm();
  const [api, contextHolder] = notification.useNotification(); // We'll style this page

  const handleFinish = (values) => {
    const payload = {
      ...values,
      InvDate: values?.InvDate?.format("YYYY-MM-DD"),
      // FBRInvDate: values?.FBRInvDate?.format("YYYY-MM-DD"),
      items: values.items,
    };
    console.log(payload, "payload111");

    if (values.items.length === 0) {
      api.error({ message: "Please add at least one item." });
      return;
    }

    onSubmit(payload);
    // form.resetFields();
    // setItems([]);
  };

  const fillSampleData = () => {
    form.setFieldsValue({
      InvType: "Sale Invoice",
      InvDate: dayjs(), // today
      InvNo: "INV12345",
      CompanyNTN: "0712345",
      CompanyName: "ABC Company",
      CompanyAddress: "KARACHI",
      CompanyProvince: "Sindh",
      CustName: "ABC Customer",
      CustNTN: "0712345",
      CustAddress: "KARACHI",
      CustProvince: "Sindh",
      CustStatus: "Registered",
      SaleType: "SN001",
      items: [
        {
          HSCode: "5202.9100",
          rate: 43,
          UOM: "KG",
          quantity: 34,
          sroScheduleNo: "34",
          sroItemSerialNo: "43",
        },
      ],
    });
  };

  const formItem = (name, label, input, placeholder = "", required = false) => (
    <Col xs={24} sm={12} md={6}>
      <Form.Item
        name={name}
        label={label}
        rules={
          required ? [{ required: true, message: `${label} is required!` }] : []
        }
      >
        {React.cloneElement(input, { placeholder })}
      </Form.Item>
    </Col>
  );

  return (
    <>
      {" "}
      {contextHolder}
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        initialValues={{
          InvDate: dayjs(), // today's date
          CustStatus: "Registered", // default selected option
          items: [{}], // default one item row
        }}
        style={{ maxWidth: "1400px", margin: "0 auto" }} // increased width
      >
        <Row gutter={16}>
          {formItem("InvType", "Invoice Type", <Input />, "Sale Invoice", true)}
          {formItem(
            "InvDate",
            "Invoice Date",
            <DatePicker style={{ width: "100%" }} />,
            "",
            true
          )}
          {formItem("InvNo", "Invoice No.", <Input />, "12345", true)}
          {formItem("CompanyNTN", "Company NTN", <Input />, "0712345", true)}
          {formItem(
            "CompanyName",
            "Company Name",
            <Input />,
            "ABC Company",
            true
          )}
          {formItem(
            "CompanyAddress",
            "Company Address",
            <Input />,
            "KARACHI",
            true
          )}
          {formItem(
            "CompanyProvince",
            "Company Province",
            <Input />,
            "Sindh",
            true
          )}
          {formItem(
            "CustName",
            "Customer Name",
            <Input />,
            "ABC Customer",
            true
          )}
          {formItem("CustNTN", "Customer NTN", <Input />, "0712345", true)}
          {formItem(
            "CustAddress",
            "Customer Address",
            <Input />,
            "KARACHI",
            true
          )}
          {formItem(
            "CustProvince",
            "Customer Province",
            <Input />,
            "Sindh",
            true
          )}
          {formItem(
            "CustStatus",
            "Customer Status",
            <Select>
              <Select.Option value="Registered">Registered</Select.Option>
              <Select.Option value="Not Registered">
                Not Registered
              </Select.Option>
            </Select>,
            "",
            true
          )}
          {formItem(
            "SaleType",
            "Sale Type Code (Scenario Id)",
            <Input />,
            "SN001, SN002, ...",
            true
          )}

          {/* {formItem(
            "TaxRate",
            "Tax Rate",
            <InputNumber
              min={0}
              max={100}
              addonAfter="%"
              style={{ width: "100%" }}
            />,
            "",
            true
          )} */}
          {/* {formItem(
            "Qty",
            "Quantity",
            <InputNumber style={{ width: "100%" }} />,
            "",
            true
          )} */}
          {/* {formItem("UOM", "UOM", <Input />, "", true)} */}
          {/* {formItem(
            "InvValue",
            "Invoice Value",
            <InputNumber style={{ width: "100%" }} />,
            "",
            true
          )} */}
          {/* {formItem(
            "FurTax",
            "FurTax",
            <InputNumber style={{ width: "100%" }} />,
            "",
            true
          )} */}
          {/* {formItem("GSTMSRO", "GSTMSRO", <Input />, "", true)}
        {formItem("GSTMSRORef", "GSTMSRORef", <Input />, "", true)} */}
          {/* {formItem("ADMProvince", "ADM Province", <Input />, "", true)} */}
          {/* {formItem("CustProvince", "Cust Province", <Input />, "", true)} */}
          {/* {formItem("HSCode", "HS Code", <Input />, "", true)}
        {formItem("productDescription", "Product Description", <Input />, "", true)}
        {formItem("productRate", "Product Rate", <Input />, "", true)}
        {formItem("sroScheduleNo", "SRO Schedule No", <Input />, "", true)}
        {formItem("sroItemSerialNo", "SRO Item Serial No", <Input />, "", true)} */}
        </Row>
        {/* <Form form={itemForm} layout="inline" style={{ marginTop: 32 }}> */}
        <Form.List name="items" initialValue={[{}]}>
          {(fields, { add, remove }) => (
            <>
              <Row gutter={16}>
                {fields.map(({ key, name, ...restField }, index) => (
                  <React.Fragment key={key}>
                    <Col span={4}>
                      <Form.Item
                        {...restField}
                        name={[name, "HSCode"]}
                        label="HSCode"
                        rules={[
                          { required: true, message: "HS Code required" },
                        ]}
                      >
                        <Input placeholder="Eg: 5202.9100" />
                      </Form.Item>
                    </Col>
                    {/* <Col span={4}>
                      <Form.Item
                        {...restField}
                        label="Sale Type Code"
                        name={[name, "SaleTypeCode"]}
                        rules={[
                          { required: true, message: "Sale Type required" },
                        ]}
                      >
                        <Input placeholder="Sale Type Code" />
                      </Form.Item>
                    </Col> */}
                    <Col span={3}>
                      <Form.Item
                        {...restField}
                        label="Tax Rate %"
                        name={[name, "rate"]}
                        rules={[
                          { required: true, message: "Tax Rate required" },
                        ]}
                      >
                        <InputNumber
                          placeholder="Tax Rate %"
                          style={{ width: "100%" }}
                        />
                      </Form.Item>
                    </Col>
                    <Col span={3}>
                      <Form.Item
                        {...restField}
                        label="UOM"
                        name={[name, "UOM"]}
                        rules={[{ required: true, message: "UOM required" }]}
                      >
                        <Input placeholder="KG" />
                      </Form.Item>
                    </Col>
                    <Col span={3}>
                      <Form.Item
                        {...restField}
                        label="Quantity"
                        name={[name, "quantity"]}
                        rules={[{ required: true, message: "Qty required" }]}
                      >
                        <InputNumber
                          placeholder="Qty"
                          style={{ width: "100%" }}
                        />
                      </Form.Item>
                    </Col>
                    <Col span={4}>
                      <Form.Item
                        {...restField}
                        label="SRO Schedule No"
                        name={[name, "sroScheduleNo"]}
                        rules={[
                          {
                            required: true,
                            message: "SRO Schedule No required",
                          },
                        ]}
                      >
                        <Input placeholder="SRO Schedule No" />
                      </Form.Item>
                    </Col>
                    <Col span={4}>
                      <Form.Item
                        {...restField}
                        label="SRO Serial No"
                        name={[name, "sroItemSerialNo"]}
                        rules={[
                          { required: true, message: "SRO Serial No required" },
                        ]}
                      >
                        <Input placeholder="SRO Item Serial No" />
                      </Form.Item>
                    </Col>
                    <Col
                      span={3}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        height: "100%", // use full height
                        paddingTop: "30px", // adjust this value to vertically align properly
                      }}
                    >
                      {fields.length > 1 && (
                        <Button
                          danger
                          onClick={() => remove(name)}
                          type="text"
                          icon={<span style={{ fontWeight: "bold" }}>🗑️</span>}
                        />
                      )}
                    </Col>
                  </React.Fragment>
                ))}
              </Row>

              <Form.Item>
                <Button type="dashed" onClick={() => add()}>
                  + Add More Items
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>
        {/* </Form> */}

        {/* <div style={{ marginTop: 16 }}>
          <strong>Added Items:</strong>
          {items.length === 0 && <p>No items added yet.</p>}
          <ul>
            {items.map((item, idx) => (
              <li key={idx}>
                {item.HSCode} - {item.SaleTypeCode} - {item.quantity} @{" "}
                {item.rate}
              </li>
            ))}
          </ul>
        </div> */}

        <Row justify="space-between" style={{ marginTop: 24 }}>
          <Col>
            <Button type="default" onClick={fillSampleData}>
              Fill Sample Data
            </Button>
          </Col>

          <Col>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                Send
              </Button>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </>
  );
};
