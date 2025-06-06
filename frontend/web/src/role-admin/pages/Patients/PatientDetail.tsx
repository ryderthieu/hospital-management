import { useParams } from "react-router";
import PageMeta from "../../components/common/PageMeta";
import { PatientDetailLayout } from "../../components/sections/patient";
import ReturnButton from "../../components/ui/button/ReturnButton";

export default function PatientDetail() {
    const { id } = useParams<{ id: string}>();

    return (
        <>
        <PageMeta
            title="Patient Detail| Admin Dashboard"
            description="This is Patient Detail Dashboard"
        />
        
        <div className="flex justify-start items-center mb-6">
            <ReturnButton />
            <h3 className="font-semibold tracking-tight">Bệnh nhân: Nguyễn Thị Phiến</h3>
        </div>
        {/* <div className="grid grid-cols-12 gap-4 md:gap-6">
        </div> */}
        <PatientDetailLayout />
        </>
    );
}
