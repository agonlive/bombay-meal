import React, { useState } from "react";
import { Card, LoadingOverlay, Image, Text, Badge, Button, Group, Textarea, FileInput, Radio, CheckIcon } from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { IKContext, IKImage, IKUpload } from 'imagekitio-react';
import axios from "axios";




export default function Form() {

  const sheetUrl = 'https://sheetdb.io/api/v1/lrlbxjz2wqd1l'
  const imgBBKey = `09de3fb63bf4601a35eccb68ddba7ef3`
  const [date, setDate] = useState(new Date())
  const [des, setDes] = useState('')
  const [image, setImage] = useState(null)
  const [goodMeal, setGoodMeal] = useState('Yes')
  const [loading, setLoading] = useState(false)
  const [base64String, setBase64String] = useState(null)


  const onClickSave = async (e) => {
    setLoading(true)
    const today = date
    const formattedDate = formatDateToDDMMYYYY(today);
    let respondImage
    const temp = {
      no: '+ROW()-1',
      date: formattedDate,
      des: des,
      picture: image,
      good_meal: goodMeal,
    }

    if (base64String) {
      const formData = new FormData();
      formData.append('key', imgBBKey);
      formData.append('image', base64String);
      formData.append('expiration', 0)
      respondImage = await axios.post(`https://api.imgbb.com/1/upload`, formData)
      console.log('respond', respondImage.data.data.display_url);
    }
    temp.picture = respondImage.data.data.display_url

    const res = await axios.post(sheetUrl, temp)

    setLoading(false)
    alert('เซฟข้อมูลเรียบร้อยแล้ว')
  }

  function formatDateToDDMMYYYY(date) {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  }


  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      const reader = new FileReader();

      reader.onload = (e) => {
        const base64 = e.target.result.split('data:image/png;base64,')[1] ?? '';

        setBase64String(base64); // Set the Base64 string

      };

      reader.readAsDataURL(file);
      console.log('file', file);

    } else {
      // Handle the case when no file is selected
      // setPreviewSrc('');
      // setBase64String('');
    }
  };

  const onChangeDate = (e) => {
    setDate(e)
  }


  return <div className="">
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
          gradient={{ from: 'gray', to: 'rgba(84, 84, 84, 1)', deg: 90 }}> เพิ่มรายการอาหาร 🍳 </Text>
      </Card.Section>

      <div className="flex flex-col gap-3">

        <div>
          <DateInput

            value={date}
            onChange={onChangeDate}
            placeholder="วันที่ลงภาพ"
          />
        </div>
        <div>
          <Textarea
            value={des}
            onChange={(e) => setDes(e.target.value)}
            placeholder="อธิบายคราวๆ อาหาร"
          />
        </div>

        <input type="file" onChange={handleImageChange} />

        <div className="flex gap-2">
          <Radio icon={CheckIcon} label="✅ Good meal" name="check" value="Yes" defaultChecked onChange={(e) => setGoodMeal(e.target.value)} />
          <Radio icon={CheckIcon} label="👎🏻 Bad meal" name="check" value="No" onChange={(e) => setGoodMeal(e.target.value)} />
        </div>

        <Button onClick={onClickSave} color="violet" className="bg-[#228be6] text-[#fff] border-0" justify="center" fullWidth variant="default" mt="md">
          ⭐️ Save
        </Button>

      </div>
    </Card>
  </div>;
}
