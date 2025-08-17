"use client";
import { toast } from "sonner";
import { supabase } from "@/utils/supabase/client";
import { Board } from "@/types";

function useCreateBoard() {
  const CreateBoard = async (
    boardId: number,
    column: string,
    newValue: Board[] | undefined
  ) => {
    try {
      const { data, error, status } = await supabase
        .from("todos")
        .update({
          [column]: newValue,
        })
        .eq("id", boardId)
        .select();

      if (data && status === 204) {
        toast("ToDoBoard 생성 완료", {
          description: "새로운 TO DO BOARD가 생성되었습니다.",
        });
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
  return CreateBoard;
}
export { useCreateBoard };
