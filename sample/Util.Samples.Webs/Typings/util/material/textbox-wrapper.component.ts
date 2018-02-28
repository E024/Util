﻿//============== 文本框包装器=====================
//Copyright 2018 何镇汐
//Licensed under the MIT license
//================================================
import { Component, Input, OnInit, Host, Optional } from '@angular/core';
import { NgForm } from '@angular/forms';
import { FormControlWrapperBase } from './base/form-control-wrapper-base';
import { MessageConfig } from '../config/message-config';

/**
 * Mat文本框包装器
 */
@Component({
    selector: 'mat-textbox-wrapper',
    template: `
        <mat-form-field [floatPlaceholder]="floatPlaceholder">
            <input matInput [name]="name" [type]="type" [placeholder]="placeholder" [disabled]="disabled" [readonly]="readonly"
                #control #controlModel="ngModel" [ngModel]="model" (ngModelChange)="onModelChange($event)" 
                (blur)="blur($event)" (focus)="focus($event)" (keyup)="keyup($event)" (keydown)="keydown($event)"
                [required]="required" [email]="type==='email'"
                [minlength]="minLength" [maxlength]="maxLength"
            />
            <mat-hint *ngIf="startHint" align="start">{{startHint}}</mat-hint>
            <mat-hint *ngIf="endHint" align="end">{{endHint}}</mat-hint>
            <span *ngIf="prefixText" matPrefix>{{prefixText}}&nbsp;</span>
            <button *ngIf="showClearButton&&model" matSuffix mat-button mat-icon-button  (click)="controlModel.reset()" [matTooltip]="clearButtonTooltip">
                <mat-icon >close</mat-icon>
            </button>
            <mat-icon *ngIf="suffixMaterialIcon" matSuffix [style.cursor]="'pointer'" (click)="$event.stopPropagation();suffixIconClick()">{{suffixMaterialIcon}}</mat-icon>
            <i *ngIf="suffixFontAwesomeIcon" matSuffix class="fa fa-lg {{suffixFontAwesomeIcon}}" [style.cursor]="'pointer'" (click)="$event.stopPropagation();suffixIconClick()"></i>
            <span *ngIf="suffixText" matSuffix>{{suffixText}}</span>            
            <mat-error *ngIf="controlModel?.invalid">{{getErrorMessage()}}</mat-error>
        </mat-form-field>
    `,
    host: {
        'class': 'util-form-field',
    }
})
export class TextBoxWrapperComponent extends FormControlWrapperBase implements OnInit {
    /**
     * 是否密码框
     */
    private isPassword: boolean;
    /**
     * 密码显示隐藏开关
     */
    private hide: boolean;
    /**
     * 清除按钮提示
     */
    private clearButtonTooltip: string;
    /**
     * 是否显示清除按钮
     */
    @Input() showClearButton: boolean;
    /**
     * 文本框类型，可选值：text,password,number,email,date
     */
    @Input() type: string;
    /**
     * 只读
     */
    @Input() readonly: boolean;
    /**
     * 最小长度
     */
    @Input() minLength: number;
    /**
     * 最小长度验证消息
     */
    @Input() minLengthMessage: string;
    /**
     * 最大长度
     */
    @Input() maxLength: number;
    /**
     * 电子邮件验证消息
     */
    @Input() emailMessage: string;

    /**
     * 初始化Mat文本框包装器
     * @param form 表单
     */
    constructor(@Optional() @Host() form: NgForm) {
        super(form);
        this.clearButtonTooltip = MessageConfig.clear;
        this.showClearButton = true;
    }

    /**
     * 组件初始化
     */
    ngOnInit() {
        this.initPassword();
    }

    /**
     * 初始化密码框
     */
    private initPassword() {
        if (this.type !== "password")
            return;
        this.isPassword = true;
        this.hide = true;
        this.togglePassword();
    }

    /**
     * 切换密码显示状态
     */
    private togglePassword() {
        this.suffixMaterialIcon = this.hide ? 'visibility' : 'visibility_off';
        this.type = this.hide ? 'password' : 'text';
        this.hide = !this.hide;
    }

    /**
     * 后缀图标单击事件
     */
    protected suffixIconClick() {
        super.suffixIconClick();
        if (this.isPassword)
            this.togglePassword();
    }

    /**
     * 获取错误消息
     */
    private getErrorMessage(): string {
        if (!this.controlModel)
            return "";
        if (this.controlModel.hasError('required'))
            return this.requiredMessage;
        if (this.controlModel.hasError('minlength'))
            return this.minLengthMessage || MessageConfig.minLengthMessage.replace(/\{0\}/, String(this.minLength));
        if (this.controlModel.hasError('email'))
            return this.emailMessage || MessageConfig.emailMessage;
        return "";
    }
}