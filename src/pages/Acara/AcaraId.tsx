import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@govtechmy/myds-react/button";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbSeparator,
    BreadcrumbPage,
} from "@govtechmy/myds-react/breadcrumb";
import { ClockIcon, PdfIcon, PrinterIcon } from "@govtechmy/myds-react/icon";
import { clx } from "@govtechmy/myds-react/utils";
import SocialLinks from "../../components/shared/SocialLinks";
import { dataItemCalendar, siaranAcaraDummyDocuments, siaranSocialLinks } from "../../contentData";
import { generateDownloadLink } from "../../services/s3.svc";
import DotIcon from "../../icons/DotIcon";

export default function SiaranId() {
    const navigate = useNavigate();
    const { lang } = useParams<{ lang: string }>();

    // Find the news item by ID
    const calendarItem = dataItemCalendar.find(item => item.id);
    const filesItem = siaranAcaraDummyDocuments;

    const formatFileSize = (size: number) => {
        if (size < 1024) return `${size} B`
        if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`
        return `${(size / 1024 / 1024).toFixed(1)} MB`
    }

    // If item not found, show error message
    if (!calendarItem) {
        return (
            <div className="px-4 md:px-20 py-12">
                <div className="max-w-4xl mx-auto text-center">
                    <h1 className="text-3xl font-bold mb-4">Siaran Tidak Dijumpai</h1>
                    <p className="text-gray-600 mb-6">
                        Maaf, siaran yang anda cari tak wujud.
                    </p>
                    <Button onClick={() => navigate(`/${lang}/siaran`)}>
                        Kembali ke Siaran
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className=" py-12 px-[18px] md:px-20  md:flex md:justify-center print:py-0">
            <div className="flex flex-col gap-6 max-w-[825px]">
                <Breadcrumb className="md:px-10 print:hidden">
                    <BreadcrumbItem>
                        <BreadcrumbLink href={`/${lang}/siaran`}>Siaran</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage>{calendarItem.title}</BreadcrumbPage>
                    </BreadcrumbItem>
                </Breadcrumb>

                <div className="flex flex-col gap-3 md:px-10">
                    <span className={clx("text-sm font-semibold text-success-700")}>
                        Acara
                    </span>
                    <p className=" text-2xl font-semibold">{calendarItem.title}</p>

                    <div className=" flex flex-row gap-2 text-bg-black-500 items-center">
                        <div className=" flex flex-row gap-1 items-center">
                            <ClockIcon /> Bacaan {calendarItem.readTime}
                        </div>
                        <DotIcon />
                        <div>{calendarItem.date}, 2:30PM</div>
                    </div>
                </div>

                <div className="md:px-10 print:hidden">
                    <div className="flex justify-between pb-[18px] border-b-2 border-gray-200">
                        <SocialLinks links={siaranSocialLinks} classNameButton="p-2" />
                        <div className="flex items-center ">
                            <Button variant="default-outline" onClick={() => window.print()}>
                                <PrinterIcon /> Cetak
                            </Button>
                        </div>
                    </div>
                </div>


                <div className="flex flex-col gap-3">
                    <img
                        src={calendarItem.imageSrc}
                        alt={calendarItem.imageAlt}
                        className="min-h-[250px] rounded-lg"
                    />
                    <span className="text-bg-black-500 text-center">
                        Image from {calendarItem.link}
                    </span>
                </div>

                <p className=" text-2xl font-semibold md:px-10">
                    {calendarItem.description}
                </p>

                <p className="md:px-10">{calendarItem.content}</p>

                <div className="border-t border-otl-gray-200 md:mx-10">
                    <div className="mt-6 flex flex-col gap-y-2 sm:flex-row justify-between flex-wrap">
                        {
                            filesItem.map((file, index) => {
                                const parts = file.name.split('.')
                                const extension = parts.length > 1 ? '.' + parts.pop() : ''
                                const basename = parts.join('.')

                                return (
                                    <div
                                        key={index}
                                        className="border border-otl-gray-200 w-full sm:w-[217px] rounded-lg cursor-pointer flex items-center justify-between p-2 gap-2 "
                                        // Uncomment this line once download endpoint is ready
                                        /* onClick={() => generateDownloadLink(file.name, file.fileurl ?? '')} */
                                    >
                                        <div className="flex items-center gap-2 overflow-hidden">
                                            {file.type.startsWith('image/')
                                                ? (() => {
                                                    const extendedFile = file as File & {
                                                        isExistingFile?: boolean
                                                        s3Url?: string
                                                        fileurl?: string
                                                        thumbnailUrl?: string
                                                    }
                                                    if (extendedFile.isExistingFile) {
                                                        const imageUrl = extendedFile.thumbnailUrl || extendedFile.fileurl || extendedFile.s3Url
                                                        const fullImageUrl = extendedFile.fileurl || extendedFile.s3Url || extendedFile.thumbnailUrl
                                                        if (imageUrl) {
                                                            return (
                                                                <img
                                                                    src={imageUrl}
                                                                    alt={file.name}
                                                                    className="shrink-0 size-[38px] rounded-[4px] object-cover cursor-pointer hover:opacity-80 transition-opacity"
                                                                    onClick={e => {
                                                                        e.stopPropagation()
                                                                        if (fullImageUrl) {
                                                                            window.open(fullImageUrl, '_blank')
                                                                        }
                                                                    }}
                                                                />
                                                            )
                                                        }
                                                        return (
                                                            <div className="shrink-0 size-[30px] rounded-[4px] bg-otl-gray-200 flex items-center justify-center">
                                                                <span className="text-xs text-otl-gray-500">IMG</span>
                                                            </div>
                                                        )
                                                    }
                                                    try {
                                                        return (
                                                            <img
                                                                src={URL.createObjectURL(file)}
                                                                alt={file.name}
                                                                className="shrink-0 size-[38px] rounded-[4px] object-cover"
                                                            />
                                                        )
                                                    } catch (error) {
                                                        console.warn('Failed to create object URL:', error)
                                                        return (
                                                            <div className="shrink-0 size-[30px] rounded-[4px] bg-otl-gray-200 flex items-center justify-center">
                                                                <span className="text-xs text-otl-gray-500">IMG</span>
                                                            </div>
                                                        )
                                                    }
                                                })()
                                                : file.type === 'application/pdf'
                                                    ? (() => {
                                                        const extendedFile = file as File & {
                                                            isExistingFile?: boolean
                                                            s3Url?: string
                                                            fileurl?: string
                                                            thumbnailUrl?: string
                                                        }
                                                        const s3URLRedirect = extendedFile.fileurl || extendedFile.s3Url || extendedFile.thumbnailUrl
                                                        return (
                                                            <PdfIcon
                                                                className="shrink-0 size-[30px] rounded-[4px] object-cover cursor-pointer hover:opacity-80 transition-opacity"
                                                                onClick={e => {
                                                                    e.stopPropagation()
                                                                    if (s3URLRedirect) {
                                                                        window.open(s3URLRedirect, '_blank')
                                                                    }
                                                                }}
                                                            />
                                                        )
                                                    })()
                                                    : null}

                                            <div className="text-start overflow-hidden">
                                                <div className="flex items-center">
                                                    <div className="max-w-[95px] truncate">{basename}</div>
                                                    <div className="flex-shrink-0">{extension}</div>
                                                </div>
                                                <div className="text-[#71717A] text-xs">{formatFileSize(file.size)}</div>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>
            </div>
        </div>
    );
}
