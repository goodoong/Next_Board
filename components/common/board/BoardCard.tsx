"use client";

import {
  Button,
  Checkbox,
  Card,
  LabelDatePicker,
  Separator,
} from "@/components/ui";
import { ChevronDown, ChevronUp } from "lucide-react";
import { MarkdownDialog } from "@/components/common";
import { Board } from "@/types";
import { useCreateBoard, useDeleteBoard, useGetTaskById } from "@/hooks/apis";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { useAtomValue } from "jotai";
import { taskAtom } from "@/store/atoms";
import { useState } from "react";
import MDEditor from "@uiw/react-md-editor";

interface Props {
  board: Board;
}

function BoardCard({ board }: Props) {
  const { id } = useParams();
  //TASK의 개발 TODO-BOARD 삭제
  const handleDeleteBoard = useDeleteBoard(Number(id), board.id);
  const task = useAtomValue(taskAtom);
  const { getTaskById } = useGetTaskById(Number(id));

  const updateBoard = useCreateBoard();

  const [startDate, setStartDate] = useState<Date | undefined>(
    board.startDate ? new Date(board.startDate) : undefined
  );
  const [endDate, setEndDate] = useState<Date | undefined>(
    board.startDate ? new Date(board.startDate) : undefined
  );
  const [isShowContent, setIsShowContent] = useState<boolean>(false);

  //등록 버튼 클릭 시
  const handleSaveBoard = async (boardId: string) => {
    if (!board.title) {
      toast("TODO-BOARD를 저장할 수 없습니다.", {
        description: "TODO-BOARD를 저장하기 전 제목을 먼저 등록해주세요",
        className: "bg-red-500 text-white border-red-600",
      });
      return;
    }
    if (!startDate || !endDate)
      //해당 Board에 대한 데이터가 수정이 되도록 한다.
      try {
        // boards 배열에서 선택한 board를 찾고, 수정된 값으로 업데이트
        const newBoards = task?.contents.map((board: Board) => {
          if (board.id === boardId) {
            return { ...board, startDate, endDate };
          }
          return board;
        });
        await updateBoard(Number(id), "contents", newBoards);
        getTaskById();
      } catch (error) {
        // 네트워크 오류나 예기치 않은 에러를 잡기 위해 catch 구문 사용
        throw error;
      }
  };

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
        <Button
          variant={"ghost"}
          size={"icon"}
          onClick={() => setIsShowContent(!isShowContent)}
        >
          {isShowContent ? (
            <ChevronUp className="text-[#6d6d6d]" />
          ) : (
            <ChevronDown className="text-[#6d6d6d]" />
          )}
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
          <Button
            onClick={() => handleSaveBoard}
            variant={"ghost"}
            className="font-normal text-[#6d6d6d]"
          >
            Save
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
      {/* 마크다운 에디터 UI 영역 */}
      {isShowContent && (
        <MDEditor
          value={board.content ? board.content : ""}
          height={320 + "px"}
          style={{ width: 100 + "%", marginTop: 16 + "px" }}
        />
      )}
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
