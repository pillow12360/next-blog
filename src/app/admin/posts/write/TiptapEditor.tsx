'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import { useState, useEffect, useCallback } from 'react';

// 에디터 툴바 버튼용 인터페이스
interface ToolbarButtonProps {
    onClick: () => void;
    isActive?: boolean;
    disabled?: boolean;
    children: React.ReactNode;
}

// 툴바 버튼 컴포넌트
const ToolbarButton = ({
                           onClick,
                           isActive = false,
                           disabled = false,
                           children
                       }: ToolbarButtonProps) => {
    return (
        <button
            type="button"
            onClick={onClick}
            disabled={disabled}
            className={`p-2 rounded-md transition-colors ${
                isActive
                    ? 'bg-slate-200 text-slate-900'
                    : 'text-slate-600 hover:bg-slate-100'
            } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        >
            {children}
        </button>
    );
};

// 에디터 컴포넌트 인터페이스
interface TiptapEditorProps {
    value: string;
    onChange: (value: string) => void;
}

const TiptapEditor = ({ value, onChange }: TiptapEditorProps) => {
    // useState로 초기 컨텐츠 설정
    const [initialContent, setInitialContent] = useState('');

    // 처음 마운트될 때만 초기 컨텐츠 설정
    useEffect(() => {
        if (!initialContent && value) {
            setInitialContent(value);
        }
    }, [value, initialContent]);

    // 에디터 인스턴스 생성
    const editor = useEditor({
        extensions: [
            StarterKit,
            Placeholder.configure({
                placeholder: '내용을 입력하세요...',
            }),
            Link.configure({
                openOnClick: false,
                HTMLAttributes: {
                    class: 'text-blue-500 underline',
                },
            }),
            Image.configure({
                HTMLAttributes: {
                    class: 'max-w-full rounded-md',
                },
            }),
        ],
        content: initialContent,
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
    });

    // 이미지 추가 핸들러
    const addImage = useCallback(() => {
        if (!editor) return;

        const url = window.prompt('이미지 URL을 입력하세요.');

        if (url) {
            editor.chain().focus().setImage({ src: url }).run();
        }
    }, [editor]);

    // 링크 추가 핸들러
    const setLink = useCallback(() => {
        if (!editor) return;

        const previousUrl = editor.getAttributes('link').href;
        const url = window.prompt('URL을 입력하세요:', previousUrl);

        // 취소하면 링크 삭제
        if (url === null) {
            return;
        }

        // 빈 문자열이면 링크 삭제
        if (url === '') {
            editor.chain().focus().extendMarkRange('link').unsetLink().run();
            return;
        }

        // 유효한 URL인지 확인
        if (!/^https?:\/\//i.test(url)) {
            editor.chain().focus().extendMarkRange('link').setLink({ href: `https://${url}` }).run();
        } else {
            editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
        }
    }, [editor]);

    if (!editor) {
        return <div className="p-4 text-gray-400">에디터 로딩 중...</div>;
    }

    return (
        <div className="tiptap-editor">
            {/* 에디터 툴바 */}
            <div className="flex flex-wrap gap-1 p-2 bg-white border-b">
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    isActive={editor.isActive('bold')}
                >
                    <span className="font-bold">B</span>
                </ToolbarButton>

                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    isActive={editor.isActive('italic')}
                >
                    <span className="italic">I</span>
                </ToolbarButton>

                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleStrike().run()}
                    isActive={editor.isActive('strike')}
                >
                    <span className="line-through">S</span>
                </ToolbarButton>

                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleCode().run()}
                    isActive={editor.isActive('code')}
                >
                    <span className="font-mono">{'<>'}</span>
                </ToolbarButton>

                <div className="h-6 w-px bg-gray-300 mx-1"></div>

                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                    isActive={editor.isActive('heading', { level: 1 })}
                >
                    <span className="font-bold">H1</span>
                </ToolbarButton>

                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                    isActive={editor.isActive('heading', { level: 2 })}
                >
                    <span className="font-bold">H2</span>
                </ToolbarButton>

                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                    isActive={editor.isActive('heading', { level: 3 })}
                >
                    <span className="font-bold">H3</span>
                </ToolbarButton>

                <div className="h-6 w-px bg-gray-300 mx-1"></div>

                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    isActive={editor.isActive('bulletList')}
                >
                    <span>•</span>
                </ToolbarButton>

                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    isActive={editor.isActive('orderedList')}
                >
                    <span>1.</span>
                </ToolbarButton>

                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                    isActive={editor.isActive('codeBlock')}
                >
                    <span className="font-mono">{'{ }'}</span>
                </ToolbarButton>

                <div className="h-6 w-px bg-gray-300 mx-1"></div>

                <ToolbarButton onClick={setLink} isActive={editor.isActive('link')}>
                    <span className="underline">Link</span>
                </ToolbarButton>

                <ToolbarButton onClick={addImage}>
                    <span>🖼️</span>
                </ToolbarButton>

                <div className="h-6 w-px bg-gray-300 mx-1"></div>

                <ToolbarButton
                    onClick={() => editor.chain().focus().undo().run()}
                    disabled={!editor.can().undo()}
                >
                    <span>↩️</span>
                </ToolbarButton>

                <ToolbarButton
                    onClick={() => editor.chain().focus().redo().run()}
                    disabled={!editor.can().redo()}
                >
                    <span>↪️</span>
                </ToolbarButton>
            </div>

            {/* 에디터 컨텐츠 */}
            <div className="p-4 prose prose-sm sm:prose max-w-none min-h-[250px]">
                <EditorContent editor={editor} />
            </div>
        </div>
    );
};

export default TiptapEditor;
