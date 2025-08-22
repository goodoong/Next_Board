"use client";

import { Button, Progress, LabelDatePicker } from "@/components/ui";

import Image from "next/image";
import {
  BoardCard,
  DeleteTaskPopup,
  SideNavigation,
} from "@/components/common";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { nanoid } from "nanoid";
import { ChevronLeft } from "lucide-react";
import { Board } from "@/types";
import { useGetTaskById, useCreateBoard, useGetTasks } from "@/hooks/apis";
import { toast } from "sonner";
import { supabase } from "@/utils/supabase/client";

function TaskPage() {
  const router = useRouter();
  const { id } = useParams();
  const createBoard = useCreateBoard();
  const { getTasks } = useGetTasks();
  const { task } = useGetTaskById(Number(id));
  const [boards, setBoards] = useState<Board[]>([]);
  const [startDate, setStartDate] = useState<Date | undefined>(new Date());
  const [endDate, setEndDate] = useState<Date | undefined>(new Date());
  const [title, setTitle] = useState<string>("");
const [count, setCount] = useState<number>(0);

  useEffect(() => {
    if (task) {
      setTitle(task.title || "");
      setStartDate(task.start_date ? new Date(task.start_date) : undefined);
      setEndDate(task.end_date ? new Date(task.end_date) : undefined);
      setBoards(task.contents);
    }
  }, [task]);

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

  const handleSave = async () => {
    if (!title || !startDate || !endDate) {
      toast("기입되지 않은 데이터가 있습니다.", {
        description: "제목, 시작일, 종료일은 필수 값입니다.",
        className: "bg-red-500 text-white border-red-600",
      });
      return;
    }
    try {
      const { data, error, status } = await supabase
        .from("todos")
        .update({
          title: title,
          start_date: startDate,
          end_date: endDate,
        })
        .eq("id", id)
        .select();

      if (data && status === 200) {
        toast("TASK 저장 완료", {
          description: "TASK의 마감일을 꼭 지켜주세요!",
        });
        // 서버에서 데이터 갱신 후 상태값 업데이트
        // SideNavigation 컴포넌트 리스트 정보를 실시간으로 업데이트하기 위해 getTasks 호출
        getTasks();
      }
      if (error) {
        toast("에러 발생", {
          description: `Supabase 오류: ${error.message}`,
          className: "bg-red-500 text-white border-red-600",
        });
      }
    } catch (error) {
      console.log(error);
      toast("네트워크 오류", {
        description: `서버와 연결할 수 없습니다. 다시 시도해주세요
          ${error}`,
        className: "bg-red-500 text-white border-red-600",
      });
    }
  };

  useEffect(()=> {
if(task?.contents) {
 const completedCount = task.contents.filter((board: Board) => board.isCompleted).length;
 setCount(completedCount);
}
  }, [task?.contents])
  return (
    <div className="w-full">
      <div className="bg-white top-25 mx-4 pt-4 flex justify-between items-center gap-2">
        <Button
          variant={"outline"}
          size={"icon"}
          onClick={() => router.push("/")}
        >
          <ChevronLeft />
        </Button>
        <div className="flex items-center gap-2">
          <Button
            variant={"ghost"}
            size="lg"
            className="bg-green-50 text-green-500 hover:bg-green-100 hover: text-green-600"
            onClick={handleSave}
          >
            저장
          </Button>
          <DeleteTaskPopup>
            <Button
              variant={"ghost"}
              size="lg"
              className="bg-rose-50 text-rose-500 hover:bg-rose-100 hover:text-rose-600"
            >
              삭제
            </Button>
          </DeleteTaskPopup>
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
            <span className="text-[#6d6d6d]">{count}/{task?.contents.length} completed</span>
            {/* 프로그레스 바 UI */}
            <Progress value={task && task.contents.length>0? (count/task.contents.length)*100 : 0} className="w-[40%] h-2" />
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-[20px]">
              {/* 캘린더 UI */}
              <LabelDatePicker
                label="From"
                value={startDate}
                onChange={setStartDate}
              />
              <LabelDatePicker
                label="To"
                value={endDate}
                onChange={setEndDate}
              />
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
      <div className="flex items-center justify-center w-full h-full p-[24px]">
        {boards.length !== 0 ? (
          <div className="w-full h-full flex flex-col items-center justify-start gap-4">
            {/* Add New Board 버튼 클릭으로 인한 Board 데이터가 있을 경우 */}
            {boards.map((board: Board) => {
              return <BoardCard key={board.id} board={board} />;
            })}
          </div>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center">
            {/* Add New Board 버튼 클릭으로 인한 Board 데이터가 없을 경우 */}
            <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
              There is no board yet.
            </h3>
            <span className="text-[18px] text-[#454545] mt-[18px] mb-[28px]">
              Click the button and start flashing!
            </span>
            <button onClick={handleAddBoard}>
              <Image
                src="/assets/img/plus-button.svg"
                alt="plus-button"
                width={74}
                height={74}
              />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default TaskPage;
