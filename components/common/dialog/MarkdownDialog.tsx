"use client";

import {
  Checkbox,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  LabelDatePicker,
  Button,
  Separator,
} from "@/components/ui";
import styles from "./MarkdownDialog.module.scss";
import MDEditor from "@uiw/react-md-editor";
import { toast } from "sonner";
import { DialogClose } from "@radix-ui/react-dialog";
import { useState } from "react";
import { useParams } from "next/navigation";
import { DialogDescription } from "@/components/ui/dialog";
import { Task, Board } from "@/types";
import { useCreateBoard } from "@/hooks/apis";

interface Props {
  children: React.ReactNode;
  board: Board;
}

function MarkdownDialog({ board, children }: Props) {
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const { id } = useParams();
  const updateBoard = useCreateBoard();
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [title, setTitle] = useState<string>("");
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);

  const [content, setContent] = useState<string | undefined>(
    "**hello world!**"
  );

  const initState = () => {
    setIsCompleted(false);
    setTitle("");
    setStartDate(undefined);
    setEndDate(undefined);
    setContent("**hello world!**");
  };

  // 다이얼로그 닫기
  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    initState();
  };

  //등록 버튼 클릭 시
  const handleSubmit = async (boardId: string) => {
    if (!title || !content) {
      toast("기입되지 않은 데이터가 있습니다.", {
        description: "제목, 콘텐츠 값을 모두 작성해주세요.",
      });
      return;
    }
    //해당 Board에 대한 데이터가 수정이 되도록 한다.
    try {
      // boards 배열에서 선택한 board를 찾고, 수정된 값으로 업데이트
      const newBoards = task.boards.map((board: Board) => {
        if (board.id === boardId) {
          return { ...board, isCompleted, title, startDate, endDate, content };
        }
        return board;
      });
      await updateBoard(Number(id), "boards", newBoards);
      handleCloseDialog();
    } catch (error) {
      // 네트워크 오류나 예기치 않은 에러를 잡기 위해 catch 구문 사용
      throw error;
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            <div className="flex items-center justify-start gap-2">
              <Checkbox className="w-5 min-w-5 h-5" checked={true} />
              <input
                type="text"
                placeholder="Write a title for your board."
                className=" w-full text-xl outline-none bg-transparent"
                onChange={(event) => setTitle(event.target.value)}
              />
            </div>
          </DialogTitle>
          <DialogDescription>
            마크다운 에디터를 사용해 TOBO-BOARD를 예쁘게 꾸며보세요.
          </DialogDescription>
        </DialogHeader>
        {/* 캘린더 박스  */}
        <div className="flex items-center gap-5">
          <LabelDatePicker label="From" />
          <LabelDatePicker label="To" />
        </div>
        <Separator />
        {/* 마크다운 에디터 UI 영역 */}
        <MDEditor onChange={setContent} height={320 + "px"} />

        <DialogFooter>
          <DialogClose asChild>
            <Button variant={"outline"}>취소</Button>
          </DialogClose>
          <Button
            type={"submit"}
            onClick={() => handleSubmit(board.id)}
            className="font-normal border-emerald-500 bg-emerald-400 text-white hover:bg-emerald-500 hover:text-white"
          >
            등록
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export { MarkdownDialog };
