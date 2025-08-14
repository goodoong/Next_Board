"use client";
//클라이언트 쪽에서 렌더링 됨을 명시
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { supabase } from "@/utils/supabase";
import { toast } from "sonner";

function InitPage() {
  const router = useRouter();

  //page 생성 및 supabase 연동
  const handleCreateTask = async () => {
    const { error, status } = await supabase
      .from("todos")
      .insert([
        {
          title: "",
          start_date: new Date(),
          end_date: new Date(),
          contents: [],
        },
      ])
      .select();

    if (error) {
      console.log(error);
    }

    const { data } = await supabase.from("todos").select();

    if (status === 201) {
      toast("페이지 생성 완료", {
        description: "새로운 투두리스트가 생성되었습니다.",
      });
      if (data) {
        router.push(`/create/${data[data?.length - 1].id}`);
      } else return;
    }
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      <div className="flex flex-col items-center justify-center gap-5 mb-6">
        <span className="scroll-m20 text-2xl font-semibold tracking-tight">
          How to Start:{" "}
        </span>
        <div className="flex flex-col items-center gap-3">
          <small className="text-sm font-normal leading-none">
            1. Create a page
          </small>
          <small className="text-sm font-normal leading-none">
            2. Add boards to page
          </small>
        </div>
        {/* 페이지 추가 버튼 */}
        <Button
          className="text-[#57e79a] bg-transparent border-[#57e79a] hover:bg-[#fff9f5] w-[180px]"
          onClick={handleCreateTask}
        >
          Add new Page
        </Button>
      </div>
    </div>
  );
}

export default InitPage;
