"use client";

import { Button, Progress, LabelDatePicker } from "@/components/ui";

import Image from "next/image";
import BasicBoard from "@/components/common/board/BasicBoard";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { nanoid } from "nanoid";
import { ChevronLeft } from "lucide-react";
import { Board } from "@/types";
import { useCreateBoard } from "@/hooks/apis";

function TaskPage() {
  const router = useRouter();
  const { id } = useParams();
  const createBoard = useCreateBoard();

  const [boards, setBoards] = useState<Board[]>([]);
  const [startDate, setStartDate] = useState<Date | undefined>(new Date());
  const [endDate, setEndDate] = useState<Date | undefined>(new Date());
  const [title, setTitle] = useState<string>("");

  // Task 내의 Board 생성
  const handleAddBoard = () => {
    const newBoard: Board = {
      id: nanoid(),
      isCompleted: false,
      title: "",
      startDate: undefined,
      endDate: undefined,
      content: "",
    };

    const newBoards = [...boards, newBoard];
    setBoards(newBoards);
    //실제 supabase와 통신하는 hook
    createBoard(Number(id), "contents", newBoards);
  };

  const handleSave = () => {
    // const { data, error, status } = await supabase
    //   .from("todos")
    //   .update({
    //     title: title,
    //   })
    //   .eq("id", pathname.split("/")[2]);
    // if (error) {
    //   console.log(error);
    //   toast("에러가 발생했습니다.", {
    //     description: "콘솔 창에 출력된 에러를 확인하세요.",
    //   });
    // }
    // if (status === 204) {
    //   toast("제목 업데이트 완료", {
    //     description: "새로운 title이 설정되었습니다.",
    //   });
    //   //상태 변경 함수(ex: onSave가 호출될 때 상태 변경)
    //   setSidebarState("updated");
    // }
  };

  return (
    <div className="w-full">
      <div className="top-25 mx-4 flex justify-between items-center gap-2">
        <Button
          variant={"outline"}
          size={"icon"}
          onClick={() => router.push("/")}
        >
          <ChevronLeft />
        </Button>
        <div className="flex gap-2">
          <Button
            variant={"ghost"}
            className="bg-green-50 text-green-500 hover:bg-green-100 hover: text-green-600"
            onClick={handleSave}
          >
            저장
          </Button>
          <Button
            variant={"ghost"}
            className="bg-rose-50 text-rose-500 hover:bg-rose-100 hover:text-rose-600"
          >
            삭제
          </Button>
        </div>
      </div>
      <header className="w-full flex flex-col  py-[20px] px-[24px]  bg-white">
        <div className="flex flex-col w-full">
          <input
            type="text"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Enter Title Here"
            className="text-[36px] font-semibold outline-none placeholder:text-[#c4c4c4]"
          />
          <div className="flex items-center justify-start gap-[16px] mt-[8px] mb-[16px]">
            <span className="text-[#6d6d6d]">0/10 completed</span>
            {/* 프로그레스 바 UI */}
            <Progress value={33} className="w-[40%] h-2" />
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-[20px]">
              {/* 캘린더 UI */}
              <LabelDatePicker label="From" readonly={true} />
              <LabelDatePicker label="To" />
            </div>
            <Button
              variant={"outline"}
              onClick={handleAddBoard}
              className="w-[15%] border-emerald-400 bg-emerald-400 text-white hover:bg-emerald-600  hover:text-white"
            >
              Add New Board
            </Button>
          </div>
        </div>
      </header>
      <main className="flex items-center justify-center w-full py-[28px] px-[16px]">
        {boards?.contents.length === 0 ? (
          <div className="flex items-center justify-center w-full h-full">
            <div className="flex flex-col items-center">
              <span className="text-[24px] font-semibold text-[#454545]">
                There is no board yet
              </span>
              <span className="text-[18px] text-[#454545] mt-[18px] mb-[28px]">
                Click the button and start flashing!
              </span>
              <button
                className="flex items-center justify-center w-[74px] h-[74px] outline-none border-none cursor-pointer"
                onClick={handleAddBoard}
              >
                <Image
                  src="/assets/img/plus-button.svg"
                  alt="plus-button"
                  width={100}
                  height={100}
                />
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-start w-full h-full gap-4 overflow-y-scroll">
            {boards?.contents.map((board: BoardContent) => {
              return (
                <BasicBoard
                  key={board.boardId}
                  data={board}
                  handleBoards={setBoards}
                />
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}

export default TaskPage;
