"use client";

import { useDialog } from "@/context/DialogProvider";
import { useSnackbar } from "@/context/SnackbarProvider";
import { TransactionFields } from "@/utils/utilFnc";
import { Button } from "@mui/material";

export default function AddTask() {
  const { showSnackbar } = useSnackbar();
  const { openDialog } = useDialog();
  const handleClick = async () => {
    openDialog("form", {
      title: "กรอกข้อมูลคำสั่งซื้อ",
      inputs: [{ id: "description", label: "รายละเอียด", required: true }],
      onConfirm: async (data) => {
        console.log("check data", TransactionFields(data?.description || ""));
        // console.log("check modal data", body);
        // alert(`Submitted Data: ${JSON.stringify(body)}`);
        try {
          //   const res = await testConnection(body);
          //   if (res.result) {
          //     showSnackbar("Connection Success", "success");
          //   } else {
          //     showSnackbar(
          //       "Connection Failed, Please recheck your configuration",
          //       "error"
          //     );
          //   }
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
          showSnackbar(
            "Connection Failed, Please recheck your configuration",
            "error"
          );
        }
      },
    });
  };
  return (
    <Button onClick={handleClick} variant="contained">
      Add Task
    </Button>
  );
}
