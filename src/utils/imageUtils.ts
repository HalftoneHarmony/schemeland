/**
 * @file utils/imageUtils.ts
 * 이미지 업로드 및 처리 유틸리티
 * - Base64 변환
 * - 이미지 리사이즈 (localStorage 용량 최적화)
 * - 파일 검증
 */

// ============================================
// 설정 상수
// ============================================

/** 최대 이미지 너비 (px) */
const MAX_WIDTH = 800;
/** 최대 이미지 높이 (px) */
const MAX_HEIGHT = 600;
/** JPEG 압축 품질 (0.0 ~ 1.0) */
const COMPRESSION_QUALITY = 0.7;
/** 허용 파일 타입 */
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
/** 최대 파일 크기 (5MB) */
const MAX_FILE_SIZE = 5 * 1024 * 1024;

// ============================================
// 타입 정의
// ============================================

export interface ImageValidationResult {
    isValid: boolean;
    error?: string;
}

export interface ProcessedImage {
    base64: string;
    originalName: string;
    size: number;
}

// ============================================
// 유틸리티 함수
// ============================================

/**
 * 파일 타입 및 크기 검증
 */
export function validateImageFile(file: File): ImageValidationResult {
    if (!ALLOWED_TYPES.includes(file.type)) {
        return {
            isValid: false,
            error: `지원하지 않는 이미지 형식입니다. (허용: JPG, PNG, WebP, GIF)`
        };
    }

    if (file.size > MAX_FILE_SIZE) {
        return {
            isValid: false,
            error: `파일 크기가 너무 큽니다. (최대: 5MB)`
        };
    }

    return { isValid: true };
}

/**
 * 이미지 리사이즈 및 Base64 변환
 * - 이미지 비율 유지하면서 최대 크기 제한
 * - JPEG로 압축하여 용량 최적화
 */
export function processImage(file: File): Promise<ProcessedImage> {
    return new Promise((resolve, reject) => {
        const validation = validateImageFile(file);
        if (!validation.isValid) {
            reject(new Error(validation.error));
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                // 리사이즈 계산
                let { width, height } = img;

                if (width > MAX_WIDTH) {
                    height = Math.round((height * MAX_WIDTH) / width);
                    width = MAX_WIDTH;
                }
                if (height > MAX_HEIGHT) {
                    width = Math.round((width * MAX_HEIGHT) / height);
                    height = MAX_HEIGHT;
                }

                // Canvas로 리사이즈 및 압축
                const canvas = document.createElement('canvas');
                canvas.width = width;
                canvas.height = height;

                const ctx = canvas.getContext('2d');
                if (!ctx) {
                    reject(new Error('Canvas 생성 실패'));
                    return;
                }

                ctx.drawImage(img, 0, 0, width, height);

                // Base64로 변환 (JPEG 압축)
                const base64 = canvas.toDataURL('image/jpeg', COMPRESSION_QUALITY);

                resolve({
                    base64,
                    originalName: file.name,
                    size: base64.length
                });
            };

            img.onerror = () => reject(new Error('이미지 로드 실패'));
            img.src = e.target?.result as string;
        };

        reader.onerror = () => reject(new Error('파일 읽기 실패'));
        reader.readAsDataURL(file);
    });
}

/**
 * 파일 선택 다이얼로그 열기 (프로그래매틱)
 */
export function openFilePicker(): Promise<File | null> {
    return new Promise((resolve) => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = ALLOWED_TYPES.join(',');

        input.onchange = (e) => {
            const file = (e.target as HTMLInputElement).files?.[0] || null;
            resolve(file);
        };

        input.oncancel = () => resolve(null);
        input.click();
    });
}

/**
 * 이미지 업로드 원스텝 함수
 * - 파일 선택 → 검증 → 리사이즈 → Base64 반환
 */
export async function uploadImage(): Promise<ProcessedImage | null> {
    const file = await openFilePicker();
    if (!file) return null;

    return processImage(file);
}
