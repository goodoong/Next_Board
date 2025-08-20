"use client";

import {
  Button,
  Checkbox,
  Card,
  LabelDatePicker,
  Separator,
} from "@/components/ui";
import { ChevronUp } from "lucide-react";
import { MarkdownDialog } from "@/components/common";
import { Board } from "@/types";
import { useDeleteBoard } from "@/hooks/apis";
import { useParams } from "next/navigation";

interface Props {
  board: Board;
}

function BoardCard({ board }: Props) {
  const { id } = useParams();
  //TASK의 개발 TODO-BOARD 삭제
  const handleDeleteBoard = useDeleteBoard(Number(id), board.id);
  return (
    <Card className="w-full flex flex-col items-center p-5">
      {/* 게시물 카드 제목 영역 */}
      <div className="w-full flex items-center justify-between mb-4">
        <div className="w-full flex items-center justify-start gap-2">
          <Checkbox className="h-5 w-5" checked={board.isCompleted} />
          <input
            type="text"
            placeholder="등록된 제목이 없습니다."
            className="w-full text-xl outline-none bg-transparent"
            disabled={true}
            value={board.title}
          />
        </div>
        <Button variant={"ghost"} size={"icon"}>
          <ChevronUp className="text-[#6d6d6d]" />
        </Button>
      </div>
      {/* 캘린더 및 버튼 박스 영역 */}
      <div className="w-full flex items-center justify-between">
        {/* 캘린더박스 */}
        <div className="flex items-center gap-5">
          <LabelDatePicker
            label="From"
            value={board.startDate}
            readonly={true}
          />
          <LabelDatePicker label="To" value={board.endDate} readonly={true} />
        </div>
        {/* 버튼 박스 */}
        <div className="flex items-center">
          <Button variant={"ghost"} className="font-normal text-[#6d6d6d]">
            Duplicate
          </Button>
          <Button
            onClick={() => handleDeleteBoard(Number(id), board.id)}
            variant={"ghost"}
            className="font-normal text-rose-600 hover:text-rose-600 hover:bg-red-50"
          >
            Delete
          </Button>
        </div>
      </div>
      <Separator className="my-3" />
      <MarkdownDialog board={board}>
        <Button variant={"ghost"} className="font-normal text-[#6d6d6d]">
          {board.title ? "update Contents" : "Add Contents"}
        </Button>
      </MarkdownDialog>
    </Card>
  );
}

export { BoardCard };
