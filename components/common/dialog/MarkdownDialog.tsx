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
import MDEditor from "@uiw/react-md-editor";
import { toast } from "sonner";
import { DialogClose } from "@radix-ui/react-dialog";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { DialogDescription } from "@/components/ui/dialog";
import { Task, Board } from "@/types";
import { useCreateBoard } from "@/hooks/apis";
import { useAtomValue } from "jotai";
import { taskAtom } from "@/store/atoms";

interface Props {
  children: React.ReactNode;
  board: Board;
}

function MarkdownDialog({ board, children }: Props) {
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const { id } = useParams();
  const task = useAtomValue(taskAtom);
  const updateBoard = useCreateBoard();
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [title, setTitle] = useState<string>("");
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);

  const [content, setContent] = useState<string | undefined>(
    "**hello world!**"
  );

  const initState = () => {
    setIsCompleted(board.isCompleted || false);
    setTitle(board.title||"");
    setStartDate(board.startDate? new Date(board.startDate):undefined);
    setEndDate(board.endDate? new Date(board.endDate):undefined);
    setContent(board.content||"**hello world!**");
  };

    useEffect(()=>{
    initState();
  }, [board]);


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
      const newBoards = task?.contents.map((board: Board) => {
        if (board.id === boardId) {
          return { ...board, isCompleted, title, startDate, endDate, content };
        }
        return board;
      });
      await updateBoard(Number(id), "contents", newBoards);
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
              <Checkbox className="w-5 min-w-5 h-5" checked={isCompleted} onCheckedChange={(checked)=>{
                if(typeof checked === 'boolean') setIsCompleted(checked);
              }} />
              <input
                type="text"
                placeholder="Write a title for your board."
                className=" w-full text-xl outline-none bg-transparent"
                onChange={(event) => setTitle(event.target.value)}
                value={title ?? ""}
              />
            </div>
          </DialogTitle>
          <DialogDescription>
            마크다운 에디터를 사용해 TOBO-BOARD를 예쁘게 꾸며보세요.
          </DialogDescription>
        </DialogHeader>
        {/* 캘린더 박스  */}
        <div className="flex items-center gap-5">
          <LabelDatePicker label="From" value={startDate} onChange={setStartDate}/>
          <LabelDatePicker label="To" value={endDate} onChange={setEndDate}/>
        </div>
        <Separator />
        {/* 마크다운 에디터 UI 영역 */}
        <MDEditor value={content} onChange={setContent} height={320 + "px"} />

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
