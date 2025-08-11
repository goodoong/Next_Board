"use client";

import { Checkbox } from "@/components/ui/checkbox";
import styles from "./MarkdownDialog.module.scss";
import MDEditor from "@uiw/react-md-editor";
import { supabase } from "@/utils/supabase";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import LabelCalendar from "../calendar/LabelCalendar";
import { Separator } from "@/components/ui/separator";
import { DialogClose } from "@radix-ui/react-dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";

function MarkdownDialog() {
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string | undefined>(
    "**hello world!**"
  );

  //supabase에 저장
  const onSubmit = async () => {
    console.log("함수호출");

    if (!title || !content) {
      toast("기입되지 않은 데이터가 있습니다.", {
        description: "제목, 날짜 혹은 콘텐츠 값을 모두 작성해주세요.",
      });
      return;
    } else {
      //supabase 데이터베이스에 연동

      const { data, error, status } = await supabase
        .from("todos")
        .insert([{ title: title, content: content }])
        .select();

      if (error) {
        console.log(error);
        toast("에러가 발생했습니다.", {
          description: "콘솔 창에 출력된 에러를 확인하세요.",
        });
      }
      if (status === 201) {
        toast("생성 완료", {
          description: "작성한 글이 데이터베이스에 저장되었습니다.",
        });
      }
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <span className="font-normal text-gray-400 hover:text-gray-500 cursor-pointer">
          Add Contents
        </span>
      </DialogTrigger>
      <DialogContent className="!max-w-fit">
        <DialogHeader>
          <DialogTitle>
            <div className={styles.dialog__titleBox}>
              <Checkbox className="w-5 h-5" />
              <input
                type="text"
                placeholder="Write a title for your board."
                className={styles.dialog__titleBox__title}
                onChange={(event) => setTitle(event.target.value)}
              />
            </div>
          </DialogTitle>
          <div className={styles.dialog__calendarBox}>
            <LabelCalendar label="From" />
            <LabelCalendar label="To" />
          </div>
          <Separator />
          <div className={styles.dialog__markdown}>
            <MDEditor
              value={content}
              onChange={setContent}
              height={100 + "%"}
            />
          </div>
        </DialogHeader>
        <DialogFooter>
          <div className={styles.dialog__buttonBox}>
            <DialogClose asChild>
              <Button
                variant={"ghost"}
                className="font-normal text-gray-400 hover:bg-gray-50 hover:text-gray-500"
              >
                Cancel
              </Button>
            </DialogClose>
            <Button
              type={"submit"}
              className="font-normal border-emerald-500 bg-emerald-400 text-white hover:bg-emerald-400 hover:text-white"
              onClick={onSubmit}
            >
              Done
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default MarkdownDialog;
