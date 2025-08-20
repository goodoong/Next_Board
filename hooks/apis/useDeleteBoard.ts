"use client";

import { taskAtom } from "@/store/atoms";
import { supabase } from "@/utils/supabase/client";
import { useAtom } from "jotai";
import { toast } from "sonner";
import { useGetTaskById } from "./useGetTaskById";
import { Board } from "@/types";

function useDeleteBoard(taskId: number, boardId: string) {
  const [task] = useAtom(taskAtom);
  const { getTaskById } = useGetTaskById(taskId);

  const deleteBoard = async (taskId: number, boardId: string) => {
    try {
      const { status, error } = await supabase
        .from("todos")
        .update({
          contents: task?.contents.filter(
            (board: Board) => board.id !== boardId
          ),
        })
        .eq("id", taskId);

      if (status === 204) {
        toast("선택한 TODO-BOARD가 삭제되었습니다.", {
          description: "새로운 TODO-BOARD 생기면 추가해주세요",
        });
        //Task를 갱신
        getTaskById();
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
  return deleteBoard;
}

export { useDeleteBoard };
