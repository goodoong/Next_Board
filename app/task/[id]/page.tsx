"use client";

import { Button, Progress, LabelDatePicker } from "@/components/ui";

import Image from "next/image";
import BasicBoard from "@/components/common/board/BasicBoard";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { supabase } from "@/utils/supabase/client";
import { nanoid } from "nanoid";
import { ChevronLeft } from "lucide-react";
import { useAtom } from "jotai";
import { sidebarStateAtom } from "@/store";

interface Todo {
  id: number;
  title: string;
  start_date: string | Date;
  end_date: string | Date;
  contents: BoardContent[];
}

interface BoardContent {
  boardId: string | number;
  isCompleted: boolean;
  title: string;
  startDate: string;
  endDate: string;
  content: string;
}

function Page() {
  const router = useRouter();
  const pathname = usePathname();

  const [sidebarState, setSidebarState] = useAtom(sidebarStateAtom);
  const [board, setBoard] = useState<Todo>();
  const [startDate, setStartDate] = useState<Date | undefined>(new Date());
  const [endDate, setEndDate] = useState<Date | undefined>(new Date());
  const [title, setTitle] = useState<string>("");

  const insertRowData = async (contents: BoardContent[]) => {
    //supabase 데이터베이스에 연동
    if (board?.contents) {
      const { data, error, status } = await supabase
        .from("todos")
        .update({
          contents: contents,
        })
        .eq("id", pathname.split("/")[2])
        .select();

      if (error) {
        console.log(error);
        toast("에러가 발생했습니다.", {
          description: "콘솔 창에 출력된 에러를 확인하세요.",
        });
      }
      if (status === 200) {
        toast("추가 완료", {
          description: "새로운 TO DO BOARD가 생성되었습니다.",
        });
        getData();
      }
    } else {
      const { data, error, status } = await supabase
        .from("todos")
        .insert({
          contents: contents,
        })
        .eq("id", pathname.split("/")[2])
        .select();

      if (error) {
        console.log(error);
        toast("에러가 발생했습니다.", {
          description: "콘솔 창에 출력된 에러를 확인하세요.",
        });
      }
      if (status === 201) {
        toast("생성 완료", {
          description: "새로운 TO DO BOARD가 생성되었습니다.",
        });
        getData();
      }
    }
  };
  const createBoard = () => {
    let newContents: BoardContent[] = [];
    const BoardContent = {
      boardId: nanoid(),
      isCompleted: false,
      title: "",
      startDate: "",
      endDate: "",
      content: "",
    };

    if (board && board.contents.length > 0) {
      newContents = [...board.contents];
      //기존 데이터에 새로운 데이터 추가
      newContents.push(BoardContent);
      insertRowData(newContents);
    } else if (board && board.contents.length === 0) {
      newContents.push(BoardContent);
      insertRowData(newContents);
    }
  };
  //supabase에 기존에 생성된 보드가 있는지 없는지 확인
  const getData = async () => {
    const {
      data: todos,
      error,
      status,
    } = await supabase.from("todos").select("*");

    if (todos !== null) {
      todos.forEach((item: Todo) => {
        if (item.id === Number(pathname.split("/")[2])) {
          setBoard(item);
          setTitle(item.title); //board를 가져온 후에 title 값을 갱신
        }
      });
    }
  };

  const handleSave = async () => {
    const { data, error, status } = await supabase
      .from("todos")
      .update({
        title: title,
      })
      .eq("id", pathname.split("/")[2]);

    if (error) {
      console.log(error);
      toast("에러가 발생했습니다.", {
        description: "콘솔 창에 출력된 에러를 확인하세요.",
      });
    }
    if (status === 204) {
      toast("제목 업데이트 완료", {
        description: "새로운 title이 설정되었습니다.",
      });
      getData();

      //상태 변경 함수(ex: onSave가 호출될 때 상태 변경)
      setSidebarState("updated");
    }
  };

  useEffect(() => {
    getData();
  }, []);

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
              onClick={createBoard}
              className="w-[15%] border-emerald-400 bg-emerald-400 text-white hover:bg-emerald-600  hover:text-white"
            >
              Add New Board
            </Button>
          </div>
        </div>
      </header>
      <main className="flex items-center justify-center w-full py-[28px] px-[16px]">
        {board?.contents.length === 0 ? (
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
                onClick={createBoard}
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
            {board?.contents.map((board: BoardContent) => {
              return (
                <BasicBoard
                  key={board.boardId}
                  data={board}
                  handleBoards={setBoard}
                />
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}

export default Page;
