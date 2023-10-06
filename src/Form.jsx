import React, { useState, useRef } from "react";
import { Card, LoadingOverlay, Text, Badge, Button, Textarea, Radio, CheckIcon } from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { IKContext, IKImage, IKUpload } from 'imagekitio-react';
import axios from "axios";

export default function Form() {
  const sheetUrl = 'https://sheetdb.io/api/v1/lrlbxjz2wqd1l';
  const imgBBKey = '09de3fb63bf4601a35eccb68ddba7ef3';

  const [formValues, setFormValues] = useState({
    date: new Date(),
    des: '',
    image: null,
    goodMeal: 'Yes',
  });

  const [loading, setLoading] = useState(false);

  const inputRef = useRef(null);

  const formatDateToDDMMYYYY = (date) => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64 = e.target.result.split('data:image/png;base64,')[1] ?? '';
        setFormValues({
          ...formValues,
          image: base64,
        });
      };
      reader.readAsDataURL(file);
    } else {
      setFormValues({
        ...formValues,
        image: null,
      });
    }
  };

  const onChangeDate = (date) => {
    setFormValues({
      ...formValues,
      date,
    });
  };

  const onClickSave = async () => {
    setLoading(true);
    const formattedDate = formatDateToDDMMYYYY(formValues.date);

    try {
      // Upload image to imgBB
      const formData = new FormData();
      formData.append('key', imgBBKey);
      formData.append('image', inputRef.current.files[0]);
      formData.append('expiration', 0);
      const respondImage = await axios.post(`https://api.imgbb.com/1/upload`, formData);

      // Save data to the sheet
      const dataToSave = {
        no: '+ROW()-1',
        date: formattedDate,
        des: formValues.des,
        picture: respondImage.data.data.display_url,
        good_meal: formValues.goodMeal,
      };

      await axios.post(sheetUrl, dataToSave);

      setFormValues({
        date: new Date(),
        des: '',
        image: null,
        goodMeal: 'Yes',
      });

      setLoading(false);
      alert('เซฟข้อมูลเรียบร้อยแล้ว');
    } catch (error) {
      console.error('Error:', error);
      alert('เช็คการอัพรูปด้วย')
      setLoading(false);
    }
  };

  return (
    <div className="">
      <Card shadow="sm" padding="lg" radius="md" withBorder className="p-5">
        <LoadingOverlay
          visible={loading}
          zIndex={1000}
          overlayProps={{ radius: 'sm', blur: 2 }}
          loaderProps={{ color: 'pink', type: 'bars' }}
        />
        <Card.Section>
          <Text
            className="py-4"
            size="xl"
            fw={900}
            variant="gradient"
            gradient={{ from: 'gray', to: 'rgba(84, 84, 84, 1)', deg: 90 }}
          >
            เพิ่มรายการอาหาร 🍳
          </Text>
        </Card.Section>

        <div className="flex flex-col gap-3">
          <div>
            <DateInput
              value={formValues.date}
              onChange={onChangeDate}
              placeholder="วันที่ลงภาพ"
            />
          </div>
          <div>
            <Textarea
              value={formValues.des}
              onChange={(e) => setFormValues({ ...formValues, des: e.target.value })}
              placeholder="อธิบายคราวๆ อาหาร"
            />
          </div>

          <input
            name="inputFile"
            ref={inputRef}
            id="fileInput"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
          />

          <div className="flex gap-2">
            <Radio
              icon={CheckIcon}
              label="✅ Good meal"
              name="check"
              value="Yes"
              defaultChecked={formValues.goodMeal === 'Yes'}
              onChange={(e) => setFormValues({ ...formValues, goodMeal: e.target.value })}
            />
            <Radio
              icon={CheckIcon}
              label="👎🏻 Bad meal"
              name="check"
              value="No"
              defaultChecked={formValues.goodMeal === 'No'}
              onChange={(e) => setFormValues({ ...formValues, goodMeal: e.target.value })}
            />
          </div>

          <Button
            onClick={onClickSave}
            color="violet"
            className="bg-[#228be6] text-[#fff] border-0"
            justify="center"
            fullWidth
            variant="default"
            mt="md"
          >
            ⭐️ Save
          </Button>
        </div>
      </Card>
    </div>
  );
}
