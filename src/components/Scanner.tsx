"use client";

import { useEffect, useRef, useState } from "react";
import {
  BrowserMultiFormatReader,
  NotFoundException,
  Result,
} from "@zxing/library";
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import serverAxios from "@/axios-server";

const Scanner: React.FC = () => {
  const [videoInputDevices, setVideoInputDevices] = useState<MediaDeviceInfo[]>(
    []
  );
  const [selectedDeviceId, setSelectedDeviceId] = useState<
    string | undefined
  >();
  const [findDevice, setFindDevice] = useState<boolean>(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const codeReaderRef = useRef<BrowserMultiFormatReader | null>(null);
  const resultRef = useRef<HTMLPreElement>(null);
  const [searchParam, setSearchParam] = useState<string>("VD0001");
  const [searchRes, setSearchRes] = useState<string>();

  useEffect(() => {
    const codeReader = new BrowserMultiFormatReader();
    codeReaderRef.current = codeReader;
    codeReader
      .listVideoInputDevices()
      .then((devices) => {
        console.log("devices:", devices);
        setVideoInputDevices(devices);
        setSelectedDeviceId(devices[0]?.deviceId);
      })
      .catch((err) => console.error(err));

    return () => {
      codeReader.reset();
      // console.log(codeReader)
    };
  }, [findDevice]);

  const handleStart = () => {
    askCameraPermission();
    if (selectedDeviceId && videoRef.current) {
      codeReaderRef.current?.decodeFromVideoDevice(
        selectedDeviceId,
        videoRef.current,
        (result: Result, err) => {
          if (result) {
            resultRef.current!.textContent = result.getText();
            setSearchParam(result.getText());
          }
          if (err && !(err instanceof NotFoundException)) {
            console.error(err);
            resultRef.current!.textContent = err.toString();
          }
        }
      );
    }
  };

  const handleReset = () => {
    setSearchParam("");
    codeReaderRef.current?.reset();
    if (resultRef.current) {
      resultRef.current.textContent = "";
    }
  };

  const askCameraPermission = async (): Promise<MediaStream | null> =>
    await navigator.mediaDevices.getUserMedia({ video: true });

  const handleSearch = async () => {
    try {
      const res = await serverAxios.get(
        `/Procedure/Procedure?docEntry=${searchParam}`
      );
      const data = await res.data;
      console.log("response check", data);
      setSearchRes(`ADM Number: ${data.admNo}`);
    } catch (error) {
      console.log("error", error);
    }
  };

  return (
    <>
      <Stack height={1} spacing={2} sx={{ alignItems: "center" }}>
        <Typography variant="h3">Barcode/QRcode Scanner</Typography>
        <Stack direction={"row"} spacing={2}>
          <Button
            variant="contained"
            color="error"
            onClick={() => setFindDevice(!findDevice)}
          >
            Find Device
          </Button>
          <Button variant="contained" color="primary" onClick={handleStart}>
            Start
          </Button>
          <Button variant="contained" color="secondary" onClick={handleReset}>
            Reset
          </Button>
        </Stack>

        <Box>
          <video
            ref={videoRef}
            width="300"
            height="200"
            className="border border-gray-400"
          ></video>
        </Box>

        {videoInputDevices.length == 0 && <Stack>not found device</Stack>}
        {videoInputDevices.length > 0 && (
          <FormControl>
            <InputLabel id="video-src-label">Change video source:</InputLabel>
            <Select
              labelId="video-src-label"
              id="video-src"
              value={selectedDeviceId}
              label="Change video source:"
              onChange={(e) => setSelectedDeviceId(e.target.value)}
            >
              {videoInputDevices.map((device) => (
                <MenuItem key={device.deviceId} value={device.deviceId}>
                  {device.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}

        <Stack width={0.8} spacing={1}>
          <Typography>Result:</Typography>
          <pre
            ref={resultRef}
            className="p-4 bg-gray-50 border border-gray-800 rounded-md flex-wrap"
          ></pre>
          <TextField
            id="Search-text"
            label="Search"
            value={searchParam}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              setSearchParam(event.target.value);
            }}
          />
          <Button onClick={handleSearch} variant="contained" color="primary">
            Search
          </Button>
        </Stack>

        <Stack width={0.8} spacing={1}>
          <Typography>Search Result:</Typography>
          {!!searchRes ? (
            <Stack>
              <Typography>{searchRes}</Typography>
            </Stack>
          ) : (
            <Stack width={1}>
              <Typography>Wait for Search Result</Typography>
            </Stack>
          )}
        </Stack>
      </Stack>
    </>
  );
};

export default Scanner;
